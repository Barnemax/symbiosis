<?php

namespace App\Controller;

use App\Enum\Kingdom;
use App\Repository\SpeciesRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class KingdomsController
{
    public function __construct(private readonly SpeciesRepository $speciesRepository)
    {
    }

    #[Route('/api/kingdoms', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $counts = $this->speciesRepository->countByKingdom();

        $kingdoms = array_map(
            fn (Kingdom $k) => [
                'key' => $k->value,
                'plural' => $k->plural(),
                'slug' => $k->slug(),
                'count' => $counts[$k->value] ?? 0,
            ],
            Kingdom::cases(),
        );

        return new JsonResponse(['kingdoms' => $kingdoms]);
    }
}
