<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ApiResource(operations: [new Get(), new GetCollection()])]
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Species::class, inversedBy: 'media')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Species $species = null;

    #[ORM\Column(length: 10)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['image', 'audio', 'leaf', 'feather'])]
    #[Groups(['species:read'])]
    private string $type = '';

    #[ORM\Column(length: 500)]
    #[Assert\NotBlank]
    #[Assert\Regex(pattern: '#^(/media/|https?://)#', message: 'URL must be a local /media/ path or an HTTP(S) URL.')]
    #[Groups(['species:read'])]
    private string $url = '';

    #[ORM\Column(length: 300, nullable: true)]
    #[Groups(['species:read'])]
    private ?string $credit = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSpecies(): ?Species
    {
        return $this->species;
    }

    public function setSpecies(?Species $species): static
    {
        $this->species = $species;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getCredit(): ?string
    {
        return $this->credit;
    }

    public function setCredit(?string $credit): static
    {
        $this->credit = $credit;

        return $this;
    }
}
