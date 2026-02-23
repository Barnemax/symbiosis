<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\CommonNameRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CommonNameRepository::class)]
#[ORM\UniqueConstraint(fields: ['species', 'locale'])]
#[ApiResource(operations: [new Get(), new GetCollection()])]
class CommonName
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Species::class, inversedBy: 'commonNames')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Species $species = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['en', 'fr', 'la'])]
    #[Groups(['species:read', 'species:write', 'relationship:read'])]
    private string $locale = '';

    #[ORM\Column(length: 200)]
    #[Assert\NotBlank]
    #[Groups(['species:read', 'species:write', 'relationship:read'])]
    private string $name = '';

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

    public function getLocale(): string
    {
        return $this->locale;
    }

    public function setLocale(string $locale): static
    {
        $this->locale = $locale;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
