<?php

namespace App\Command;

use App\Entity\Media;
use App\Entity\Species;
use App\Enum\Kingdom;
use App\Repository\SpeciesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:import-media',
    description: 'Import species images from Wikimedia Commons and (optionally) bird audio from xeno-canto',
)]
class ImportMediaCommand extends Command
{
    public function __construct(
        private readonly SpeciesRepository $speciesRepository,
        private readonly EntityManagerInterface $em,
        private readonly HttpClientInterface $httpClient,
        #[\Symfony\Component\DependencyInjection\Attribute\Autowire('%app.name%')] private readonly string $appName,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('kingdom', 'k', InputOption::VALUE_REQUIRED, 'Limit to a kingdom: bird, tree, or fungus')
            ->addOption('no-audio', null, InputOption::VALUE_NONE, 'Skip bird audio from xeno-canto')
            ->addOption('xeno-canto-key', null, InputOption::VALUE_REQUIRED, 'xeno-canto API v3 key (or set XENO_CANTO_API_KEY env var)')
            ->addOption('no-leaves', null, InputOption::VALUE_NONE, 'Skip leaf images from iNaturalist')
            ->addOption('no-feathers', null, InputOption::VALUE_NONE, 'Skip feather images from iNaturalist')
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'Overwrite media that already exists');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $kingdom = $input->getOption('kingdom');
        $withLeaves = !(bool) $input->getOption('no-leaves');
        $withFeathers = !(bool) $input->getOption('no-feathers');
        $force = (bool) $input->getOption('force');
        $xenoCantoKey = $input->getOption('xeno-canto-key') ?? $_ENV['XENO_CANTO_API_KEY'] ?? null;
        $withAudio = !(bool) $input->getOption('no-audio');

        if ($withAudio && null === $xenoCantoKey) {
            $io->note('No xeno-canto API key found | skipping audio. Set XENO_CANTO_API_KEY or pass --xeno-canto-key to include it.');
            $withAudio = false;
        }

        $allSpecies = $kingdom
            ? $this->speciesRepository->findByKingdom($kingdom)
            : $this->speciesRepository->findAll();

        $io->title(sprintf('Importing media for %d species', count($allSpecies)));

        $imported = $skipped = $failed = 0;

        foreach ($allSpecies as $species) {
            $io->section($species->getScientificName());

            // ── Image ──────────────────────────────────────────────────────────
            if (!$force && $this->hasMediaType($species, 'image')) {
                $io->text('  – image already exists (use --force to overwrite)');
                ++$skipped;
            } else {
                [$url, $credit] = $this->fetchWikimediaImage($species->getScientificName(), $io);
                if (null !== $url) {
                    $this->upsertMedia($species, 'image', $url, $credit, $force);
                    $io->text("  ✓ image → $url");
                    $io->text("    credit: $credit");
                    ++$imported;
                } else {
                    $io->warning('  ✗ no image found on Wikipedia');
                    ++$failed;
                }
            }

            // ── Leaf image (trees only) ───────────────────────────────────────
            if ($withLeaves && Kingdom::Tree === $species->getFamily()?->getKingdom()) {
                if (!$force && $this->hasMediaType($species, 'leaf')) {
                    $io->text('  – leaf image already exists (use --force to overwrite)');
                    ++$skipped;
                } else {
                    [$url, $credit] = $this->fetchInatLeaf($species->getScientificName(), $io);
                    if (null !== $url) {
                        $this->upsertMedia($species, 'leaf', $url, $credit, $force);
                        $io->text("  ✓ leaf → $url");
                        $io->text("    credit: $credit");
                        ++$imported;
                    } else {
                        $io->warning('  ✗ no leaf image found on iNaturalist');
                        ++$failed;
                    }
                }
            }

            // ── Feather image (birds only) ────────────────────────────────────
            if ($withFeathers && Kingdom::Bird === $species->getFamily()?->getKingdom()) {
                if (!$force && $this->hasMediaType($species, 'feather')) {
                    $io->text('  – feather image already exists (use --force to overwrite)');
                    ++$skipped;
                } else {
                    [$url, $credit] = $this->fetchInatFeather($species->getScientificName(), $io);
                    if (null !== $url) {
                        $this->upsertMedia($species, 'feather', $url, $credit, $force);
                        $io->text("  ✓ feather → $url");
                        $io->text("    credit: $credit");
                        ++$imported;
                    } else {
                        $io->warning('  ✗ no feather image found on iNaturalist');
                        ++$failed;
                    }
                }
            }

            // ── Audio (birds only) ─────────────────────────────────────────────
            if ($withAudio && Kingdom::Bird === $species->getFamily()?->getKingdom()) {
                if (!$force && $this->hasMediaType($species, 'audio')) {
                    $io->text('  – audio already exists (use --force to overwrite)');
                    ++$skipped;
                } else {
                    [$url, $credit] = $this->fetchXenoCanto($species->getScientificName(), $xenoCantoKey, $io);
                    if (null !== $url) {
                        $this->upsertMedia($species, 'audio', $url, $credit, $force);
                        $io->text("  ✓ audio → $url");
                        ++$imported;
                    } else {
                        $io->warning('  ✗ no quality audio found on xeno-canto');
                        ++$failed;
                    }
                }
            }
        }

        $this->em->flush();

        $io->success(sprintf(
            'Done | %d imported, %d skipped, %d failed',
            $imported,
            $skipped,
            $failed,
        ));

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    // ── Wikipedia ──────────────────────────────────────────────────────────────

    /** @return array{0: string|null, 1: string|null} */
    private function fetchWikimediaImage(string $scientificName, SymfonyStyle $io): array
    {
        $title = str_replace(' ', '_', $scientificName);

        // Step 1 | resolve the lead image filename + direct URL
        // Try language editions in order until one returns a lead image
        $imageUrl = null;
        $page = null;
        foreach (['en', 'de', 'fr', 'la'] as $lang) {
            try {
                $res = $this->httpClient->request('GET', "https://{$lang}.wikipedia.org/w/api.php", [
                    'query' => [
                        'action' => 'query',
                        'titles' => $title,
                        'prop' => 'pageimages',
                        'piprop' => 'original',
                        'format' => 'json',
                        'redirects' => '1',
                    ],
                ]);
                $data = $res->toArray();
                $page = reset($data['query']['pages']);
                if (isset($page['original']['source'])) {
                    $imageUrl = $page['original']['source'];
                    break;
                }
            } catch (\Throwable $e) {
                $io->text("  API error (pageimages, {$lang}): {$e->getMessage()}");
            }
        }

        if (null === $imageUrl) {
            return [null, null];
        }

        $imageUrl = $page['original']['source'];
        // Derive the Commons filename from the URL | e.g. "Common_Blackbird.jpg"
        $imageName = rawurldecode(basename((string) parse_url($imageUrl, PHP_URL_PATH)));

        // Step 2 | fetch attribution from the File: page
        $credit = null;
        try {
            $res = $this->httpClient->request('GET', 'https://en.wikipedia.org/w/api.php', [
                'query' => [
                    'action' => 'query',
                    'titles' => "File:$imageName",
                    'prop' => 'imageinfo',
                    'iiprop' => 'extmetadata',
                    'format' => 'json',
                ],
            ]);
            $data = $res->toArray();
            $page = reset($data['query']['pages']);
            $meta = $page['imageinfo'][0]['extmetadata'] ?? [];

            $artist = isset($meta['Artist']['value'])
                ? trim(strip_tags((string) $meta['Artist']['value']))
                : null;
            $license = $meta['LicenseShortName']['value'] ?? null;

            $credit = match (true) {
                null !== $artist && null !== $license => "$artist / $license",
                null !== $license => $license,
                null !== $artist => $artist,
                default => 'Wikimedia Commons',
            };
        } catch (\Throwable) {
            // Attribution unavailable | image URL is still usable
            $credit = 'Wikimedia Commons';
        }

        return [$imageUrl, $credit];
    }

    // ── iNaturalist ───────────────────────────────────────────────────────────

    /** @return array{0: string|null, 1: string|null} */
    private function fetchInatLeaf(string $scientificName, SymfonyStyle $io): array
    {
        try {
            $res = $this->httpClient->request('GET', 'https://api.inaturalist.org/v1/observations', [
                'headers' => ['User-Agent' => "$this->appName/1.0 (nature encyclopedia)"],
                'query' => [
                    'taxon_name' => $scientificName,
                    'quality_grade' => 'research',
                    'photos' => 'true',
                    'photo_license' => 'cc-by,cc-by-sa,cc0,cc-by-nd',
                    'term_id' => 12,  // annotation: Plant Part
                    'term_value_id' => 13,  // annotation value: Leaf
                    'order_by' => 'votes',
                    'order' => 'desc',
                    'per_page' => 1,
                ],
            ]);
            $data = $res->toArray();
        } catch (\Throwable $e) {
            $io->text("  API error (iNaturalist): {$e->getMessage()}");

            return [null, null];
        }

        $photo = $data['results'][0]['photos'][0] ?? null;
        if (null === $photo) {
            return [null, null];
        }

        // Replace the square thumbnail with medium resolution
        $url = (string) preg_replace('/\/square(\.\w+)$/', '/medium$1', (string) ($photo['url'] ?? ''));
        $credit = $photo['attribution'] ?? 'iNaturalist';

        return '' !== $url ? [$url, $credit] : [null, null];
    }

    /** @return array{0: string|null, 1: string|null} */
    private function fetchInatFeather(string $scientificName, SymfonyStyle $io): array
    {
        try {
            $res = $this->httpClient->request('GET', 'https://api.inaturalist.org/v1/observations', [
                'headers' => ['User-Agent' => "$this->appName/1.0 (nature encyclopedia)"],
                'query' => [
                    'taxon_name' => $scientificName,
                    'quality_grade' => 'research',
                    'photos' => 'true',
                    'photo_license' => 'cc-by,cc-by-sa,cc0,cc-by-nd',
                    'term_id' => 22,  // annotation: Evidence of Presence
                    'term_value_id' => 23,  // annotation value: Feather
                    'order_by' => 'votes',
                    'order' => 'desc',
                    'per_page' => 1,
                ],
            ]);
            $data = $res->toArray();
        } catch (\Throwable $e) {
            $io->text("  API error (iNaturalist): {$e->getMessage()}");

            return [null, null];
        }

        $photo = $data['results'][0]['photos'][0] ?? null;
        if (null === $photo) {
            return [null, null];
        }

        $url = (string) preg_replace('/\/square(\.\w+)$/', '/medium$1', (string) ($photo['url'] ?? ''));
        $credit = $photo['attribution'] ?? 'iNaturalist';

        return '' !== $url ? [$url, $credit] : [null, null];
    }

    // ── xeno-canto ────────────────────────────────────────────────────────────

    /** @return array{0: string|null, 1: string|null} */
    private function fetchXenoCanto(string $scientificName, string $apiKey, SymfonyStyle $io): array
    {
        try {
            // v3 requires tag-based queries: sp:"Scientific name" q:A
            $res = $this->httpClient->request('GET', 'https://xeno-canto.org/api/3/recordings', [
                'query' => [
                    'query' => sprintf('sp:"%s" q:A', $scientificName),
                    'key' => $apiKey,
                ],
            ]);
            $data = $res->toArray();
        } catch (\Throwable $e) {
            $io->text("  API error (xeno-canto): {$e->getMessage()}");

            return [null, null];
        }

        $recordings = $data['recordings'] ?? [];
        if (empty($recordings)) {
            return [null, null];
        }

        $rec = $recordings[0];
        // v3 returns a full https:// URL; v2 returned //xeno-canto.org/...
        $url = str_starts_with($rec['file'], 'http') ? $rec['file'] : 'https:' . $rec['file'];
        $credit = sprintf('© %s / XC%s / %s', $rec['rec'], $rec['id'], $rec['lic']);

        return [$url, $credit];
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function hasMediaType(Species $species, string $type): bool
    {
        foreach ($species->getMedia() as $m) {
            if ($m->getType() === $type) {
                return true;
            }
        }

        return false;
    }

    private function upsertMedia(Species $species, string $type, string $url, ?string $credit, bool $force): void
    {
        if ($force) {
            foreach ($species->getMedia() as $m) {
                if ($m->getType() === $type) {
                    $m->setUrl($url)->setCredit($credit);

                    return;
                }
            }
        }

        $this->em->persist(
            (new Media())
                ->setSpecies($species)
                ->setType($type)
                ->setUrl($url)
                ->setCredit($credit)
        );
    }
}
