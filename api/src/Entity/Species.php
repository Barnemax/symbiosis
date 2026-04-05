<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\SpeciesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SpeciesRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['species:read']],
    denormalizationContext: ['groups' => ['species:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
    ],
    paginationClientEnabled: true,
)]
#[ApiFilter(SearchFilter::class, properties: [
    'id' => 'exact',
    'family.name' => 'partial',
    'family.kingdom' => 'exact',
    'slug' => 'exact',
    'scientificName' => 'ipartial',
    'commonNames.name' => 'ipartial',
])]
#[ApiFilter(OrderFilter::class, properties: ['scientificName', 'relationshipCount'])]
class Species
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['species:read', 'relationship:read', 'relationship:graph'])]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    #[Groups(['species:read', 'species:write', 'relationship:read'])]
    private string $scientificName = '';

    #[ORM\ManyToOne(targetEntity: Family::class, inversedBy: 'species')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['species:read', 'species:write', 'relationship:read'])]
    private ?Family $family = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Assert\Choice(choices: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'])]
    #[Groups(['species:read', 'species:write'])]
    private ?string $conservationStatus = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['species:read', 'species:write'])]
    private ?string $habitat = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['species:read', 'species:write'])]
    private ?float $wingspan = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['species:read', 'species:write'])]
    private ?float $maxHeight = null;

    #[ORM\Column(length: 200, unique: true, nullable: true)]
    #[Groups(['species:read', 'relationship:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['species:read', 'species:write'])]
    private ?string $substrate = null;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['species:read'])]
    private int $relationshipCount = 0;

    /** @var Collection<int, CommonName> */
    #[ORM\OneToMany(targetEntity: CommonName::class, mappedBy: 'species', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['species:read', 'species:write', 'relationship:read'])]
    private Collection $commonNames;

    /** @var Collection<int, SpeciesTranslation> */
    #[ORM\OneToMany(targetEntity: SpeciesTranslation::class, mappedBy: 'species', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['species:read', 'species:write'])]
    private Collection $translations;

    /** @var Collection<int, Media> */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'species', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['species:read'])]
    private Collection $media;

    /** @var Collection<int, Relationship> */
    #[ORM\OneToMany(targetEntity: Relationship::class, mappedBy: 'subject', cascade: ['remove'], fetch: 'EXTRA_LAZY')]
    private Collection $relationships;

    /** @var Collection<int, Relationship> */
    #[ORM\OneToMany(targetEntity: Relationship::class, mappedBy: 'object', fetch: 'EXTRA_LAZY')]
    private Collection $objectRelationships;

    public function __construct()
    {
        $this->commonNames = new ArrayCollection();
        $this->translations = new ArrayCollection();
        $this->media = new ArrayCollection();
        $this->relationships = new ArrayCollection();
        $this->objectRelationships = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScientificName(): string
    {
        return $this->scientificName;
    }

    public function setScientificName(string $name): static
    {
        $this->scientificName = $name;

        return $this;
    }

    public function getFamily(): ?Family
    {
        return $this->family;
    }

    public function setFamily(?Family $family): static
    {
        $this->family = $family;

        return $this;
    }

    public function getConservationStatus(): ?string
    {
        return $this->conservationStatus;
    }

    public function setConservationStatus(?string $status): static
    {
        $this->conservationStatus = $status;

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

    public function getWingspan(): ?float
    {
        return $this->wingspan;
    }

    public function setWingspan(?float $wingspan): static
    {
        $this->wingspan = $wingspan;

        return $this;
    }

    public function getMaxHeight(): ?float
    {
        return $this->maxHeight;
    }

    public function setMaxHeight(?float $maxHeight): static
    {
        $this->maxHeight = $maxHeight;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    #[ORM\PrePersist]
    public function generateSlug(): void
    {
        if (null === $this->slug) {
            $this->slug = (new AsciiSlugger())->slug($this->scientificName)->lower()->toString();
        }
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

    /** @return Collection<int, CommonName> */
    public function getCommonNames(): Collection
    {
        return $this->commonNames;
    }

    public function addCommonName(CommonName $commonName): static
    {
        if (!$this->commonNames->contains($commonName)) {
            $this->commonNames->add($commonName);
            $commonName->setSpecies($this);
        }

        return $this;
    }

    public function removeCommonName(CommonName $commonName): static
    {
        if ($this->commonNames->removeElement($commonName)) {
            if ($commonName->getSpecies() === $this) {
                $commonName->setSpecies(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, SpeciesTranslation> */
    public function getTranslations(): Collection
    {
        return $this->translations;
    }

    public function addTranslation(SpeciesTranslation $translation): static
    {
        if (!$this->translations->contains($translation)) {
            $this->translations->add($translation);
            $translation->setSpecies($this);
        }

        return $this;
    }

    public function removeTranslation(SpeciesTranslation $translation): static
    {
        if ($this->translations->removeElement($translation)) {
            if ($translation->getSpecies() === $this) {
                $translation->setSpecies(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, Media> */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    /** @return Collection<int, Relationship> */
    public function getRelationships(): Collection
    {
        return $this->relationships;
    }

    public function getRelationshipCount(): int
    {
        return $this->relationshipCount;
    }

    public function setRelationshipCount(int $count): static
    {
        $this->relationshipCount = $count;

        return $this;
    }
}
