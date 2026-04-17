<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Enum\Kingdom;
use App\Repository\FamilyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FamilyRepository::class)]
#[ApiResource(operations: [new Get(), new GetCollection()])]
class Family
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(writable: false, identifier: true, required: true, schema: ['type' => 'integer'])]
    #[Groups(['species:read', 'relationship:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['species:read', 'relationship:read'])]
    private string $name = '';

    #[ORM\Column(length: 20, enumType: Kingdom::class)]
    #[Assert\NotNull]
    #[Groups(['species:read', 'relationship:read'])]
    private Kingdom $kingdom;

    /** @var Collection<int, Species> */
    #[ORM\OneToMany(targetEntity: Species::class, mappedBy: 'family')]
    private Collection $species;

    public function __construct()
    {
        $this->species = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getKingdom(): Kingdom
    {
        return $this->kingdom;
    }

    public function setKingdom(Kingdom $kingdom): static
    {
        $this->kingdom = $kingdom;

        return $this;
    }

    /** @return Collection<int, Species> */
    public function getSpecies(): Collection
    {
        return $this->species;
    }
}
