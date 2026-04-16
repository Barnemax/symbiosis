<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use App\Locale;
use App\Repository\SpeciesTranslationRepository;
use App\State\TranslationProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SpeciesTranslationRepository::class)]
#[ORM\UniqueConstraint(fields: ['species', 'locale'])]
#[ApiResource(
    uriTemplate: '/species/{speciesId}/translations/{locale}',
    uriVariables: [
        'speciesId' => new Link(fromClass: Species::class, toProperty: 'species'),
        'locale' => new Link(fromProperty: 'locale'),
    ],
    operations: [
        new Patch(
            security: "is_granted('ROLE_ADMIN')",
            provider: TranslationProvider::class,
            extraProperties: [
                'parentClass' => Species::class,
                'parentProperty' => 'species',
            ],
        ),
    ],
    normalizationContext: ['groups' => ['species:read']],
    denormalizationContext: ['groups' => ['translation:write']],
)]
class SpeciesTranslation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Species::class, inversedBy: 'translations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Species $species = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: Locale::SUPPORTED)]
    #[Groups(['species:read', 'species:write'])]
    private string $locale = '';

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['species:read', 'species:write', 'translation:write'])]
    private ?string $habitat = null;

    #[ORM\Column(length: 200, nullable: true)]
    #[Groups(['species:read', 'species:write', 'translation:write'])]
    private ?string $substrate = null;

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

    public function getHabitat(): ?string
    {
        return $this->habitat;
    }

    public function setHabitat(?string $habitat): static
    {
        $this->habitat = $habitat;

        return $this;
    }

    public function getSubstrate(): ?string
    {
        return $this->substrate;
    }

    public function setSubstrate(?string $substrate): static
    {
        $this->substrate = $substrate;

        return $this;
    }
}
