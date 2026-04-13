<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\RelationshipRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RelationshipRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['relationship:read']],
    denormalizationContext: ['groups' => ['relationship:write']],
    operations: [
        new Get(uriTemplate: '/relationships/{id}', requirements: ['id' => '\d+']),
        new GetCollection(),
        new GetCollection(
            uriTemplate: '/relationships/graph',
            normalizationContext: ['groups' => ['relationship:graph']],
            paginationEnabled: false,
        ),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationClientEnabled: true,
)]
#[ApiFilter(SearchFilter::class, properties: [
    'type' => 'exact',
    'subject' => 'exact',
    'object' => 'exact',
])]
class Relationship
{
    public const TYPES = [
        'nests_in',
        'grows_on',
        'feeds_on',
        'symbiosis_with',
        'disperses_seeds_of',
        'disperses_spores_of',
        'mycorrhiza_with',
        'parasitises',
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(writable: false, identifier: true, required: true, schema: ['type' => 'integer'])]
    #[Groups(['relationship:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Species::class, inversedBy: 'relationships')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['relationship:read', 'relationship:write', 'relationship:graph'])]
    private ?Species $subject = null;

    #[ORM\ManyToOne(targetEntity: Species::class, inversedBy: 'objectRelationships')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['relationship:read', 'relationship:write', 'relationship:graph'])]
    private ?Species $object = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::TYPES)]
    #[Groups(['relationship:read', 'relationship:write', 'relationship:graph'])]
    private string $type = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['relationship:read', 'relationship:write'])]
    private ?string $notes = null;

    /** @var Collection<int, RelationshipTranslation> */
    #[ORM\OneToMany(targetEntity: RelationshipTranslation::class, mappedBy: 'relationship', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ApiProperty(required: true)]
    #[Groups(['relationship:read', 'relationship:write'])]
    private Collection $translations;

    public function __construct()
    {
        $this->translations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSubject(): ?Species
    {
        return $this->subject;
    }

    public function setSubject(?Species $subject): static
    {
        $this->subject = $subject;

        return $this;
    }

    public function getObject(): ?Species
    {
        return $this->object;
    }

    public function setObject(?Species $object): static
    {
        $this->object = $object;

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

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    /** @return Collection<int, RelationshipTranslation> */
    public function getTranslations(): Collection
    {
        return $this->translations;
    }

    public function addTranslation(RelationshipTranslation $translation): static
    {
        if (!$this->translations->contains($translation)) {
            $this->translations->add($translation);
            $translation->setRelationship($this);
        }

        return $this;
    }

    public function removeTranslation(RelationshipTranslation $translation): static
    {
        if ($this->translations->removeElement($translation)) {
            if ($translation->getRelationship() === $this) {
                $translation->setRelationship(null);
            }
        }

        return $this;
    }
}
