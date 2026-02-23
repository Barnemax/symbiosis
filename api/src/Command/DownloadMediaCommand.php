<?php

namespace App\Command;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:download-media',
    description: 'Download external media files locally and convert images to WebP',
)]
class DownloadMediaCommand extends Command
{
    private const MAX_WIDTH = 1200;
    private const WEBP_QUALITY = 82;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly HttpClientInterface $httpClient,
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('type', 't', InputOption::VALUE_REQUIRED, 'Limit to media type: image, leaf, audio')
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'Re-download and overwrite existing files');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $typeFilter = $input->getOption('type');
        $force = (bool) $input->getOption('force');
        $mediaDir = $this->projectDir . '/public/media';

        /** @var Media[] $allMedia */
        $allMedia = $this->em->getRepository(Media::class)->findAll();

        $downloaded = $skipped = $failed = 0;

        foreach ($allMedia as $media) {
            $url = $media->getUrl();
            $type = $media->getType();

            if ($typeFilter && $type !== $typeFilter) {
                continue;
            }

            $species = $media->getSpecies();
            $slug = $species?->getSlug() ?? strtolower(str_replace(' ', '-', $species?->getScientificName() ?? 'unknown'));

            $ext = 'audio' === $type ? 'mp3' : 'webp';
            $subdir = $mediaDir . '/' . $type;
            $filename = $slug . '.' . $ext;
            $targetPath = $subdir . '/' . $filename;
            $localUrl = "/media/{$type}/{$filename}";

            // Already local, skip only if the file actually exists on disk
            if (str_starts_with($url, '/media/')) {
                if (file_exists($targetPath)) {
                    ++$skipped;
                    continue;
                }
                // URL is local but file is missing, need to re-import from fixtures first
                $io->warning("  ! {$slug} ({$type}): URL is local but file is missing - run app:import-media then app:download-media");
                ++$failed;
                continue;
            }

            if (!$force && file_exists($targetPath)) {
                $io->text("  - {$slug} ({$type}): file exists, updating URL");
                $media->setUrl($localUrl);
                ++$skipped;
                continue;
            }

            $io->text("  ↓ {$slug} ({$type})…");

            $content = $this->fetch($url, $io);
            if (null === $content) {
                ++$failed;
                continue;
            }

            if (!is_dir($subdir)) {
                mkdir($subdir, 0755, true);
            }

            if ('audio' === $type) {
                file_put_contents($targetPath, $content);
            } else {
                if (!$this->saveAsWebP($content, $targetPath, $io)) {
                    ++$failed;
                    continue;
                }
            }

            $media->setUrl($localUrl);
            $io->text("    ✓ → {$localUrl}");
            ++$downloaded;
        }

        $this->em->flush();

        $io->success(sprintf('Done | %d downloaded, %d skipped, %d failed', $downloaded, $skipped, $failed));

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    private function fetch(string $url, SymfonyStyle $io): ?string
    {
        $options = [
            'headers' => ['User-Agent' => 'Symbiosis/1.0 (https://github.com; educational portfolio project)'],
            'timeout' => 30,
        ];

        try {
            $response = $this->httpClient->request('GET', $url, $options);

            if (429 === $response->getStatusCode()) {
                $retryAfter = (int) ($response->getHeaders(false)['retry-after'][0] ?? 10);
                $io->text("    rate limited | waiting {$retryAfter}s…");
                \sleep($retryAfter);
                $response = $this->httpClient->request('GET', $url, $options);

                if (200 !== $response->getStatusCode()) {
                    $io->warning("    ✗ retry failed with status {$response->getStatusCode()}");

                    return null;
                }
            }

            return $response->getContent();
        } catch (\Throwable $e) {
            $io->warning("    ✗ download failed: {$e->getMessage()}");

            return null;
        }
    }

    private function saveAsWebP(string $data, string $targetPath, SymfonyStyle $io): bool
    {
        $src = @\imagecreatefromstring($data);
        if (false === $src) {
            $io->text('    could not decode image data');

            return false;
        }

        $w = \imagesx($src);
        $h = \imagesy($src);

        if ($w > self::MAX_WIDTH) {
            $newH = (int) round($h * self::MAX_WIDTH / $w);
            $dst = \imagecreatetruecolor(self::MAX_WIDTH, $newH);
            \imagealphablending($dst, false);
            \imagesavealpha($dst, true);
            \imagecopyresampled($dst, $src, 0, 0, 0, 0, self::MAX_WIDTH, $newH, $w, $h);
            \imagedestroy($src);
            $src = $dst;
        }

        $result = \imagewebp($src, $targetPath, self::WEBP_QUALITY);
        \imagedestroy($src);

        if (!$result) {
            $io->text('    imagewebp() failed');
        }

        return $result;
    }
}
