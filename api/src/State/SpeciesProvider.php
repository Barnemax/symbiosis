<?php

namespace App\State;

use ApiPlatform\Metadata\IriConverterInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Family;
use App\Entity\Kingdoms\BirdSpecies;
use App\Entity\Kingdoms\FungusSpecies;
use App\Entity\Kingdoms\TreeSpecies;
use App\Entity\Species;
use App\Enum\Kingdom;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/** @implements ProviderInterface<Species> */
final class SpeciesProvider implements ProviderInterface
{
    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly IriConverterInterface $iriConverter,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Species
    {
        $request = $this->requestStack->getCurrentRequest();
        $body = json_decode($request?->getContent() ?? '', true);
        $familyIri = is_array($body) ? ($body['family'] ?? null) : null;
        if (!is_string($familyIri)) {
            throw new BadRequestHttpException('family IRI is required');
        }

        $family = $this->iriConverter->getResourceFromIri($familyIri);
        if (!$family instanceof Family) {
            throw new BadRequestHttpException('family IRI is invalid');
        }

        return match ($family->getKingdom()) {
            Kingdom::Bird => new BirdSpecies(),
            Kingdom::Tree => new TreeSpecies(),
            Kingdom::Fungus => new FungusSpecies(),
        };
    }
}
