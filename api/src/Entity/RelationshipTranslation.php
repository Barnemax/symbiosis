<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use App\Locale;
use App\Repository\RelationshipTranslationRepository;
use App\State\TranslationProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RelationshipTranslationRepository::class)]
#[ORM\UniqueConstraint(fields: ['relationship', 'locale'])]
#[ApiResource(
    uriTemplate: '/relationships/{relationshipId}/translations/{locale}',
    uriVariables: [
        'relationshipId' => new Link(fromClass: Relationship::class, toProperty: 'relationship'),
        'locale' => new Link(fromProperty: 'locale'),
    ],
    operations: [
        new Patch(
            security: "is_granted('ROLE_ADMIN')",
            provider: TranslationProvider::class,
            extraProperties: [
                'parentClass' => Relationship::class,
                'parentProperty' => 'relationship',
            ],
        ),
    ],
    normalizationContext: ['groups' => ['relationship:read']],
    denormalizationContext: ['groups' => ['translation:write']],
)]
class RelationshipTranslation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Relationship::class, inversedBy: 'translations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Relationship $relationship = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: Locale::SUPPORTED)]
    #[Groups(['relationship:read', 'relationship:write'])]
    private string $locale = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['relationship:read', 'relationship:write', 'translation:write'])]
    private ?string $notes = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRelationship(): ?Relationship
    {
        return $this->relationship;
    }

    public function setRelationship(?Relationship $relationship): static
    {
        $this->relationship = $relationship;

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

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }
}
