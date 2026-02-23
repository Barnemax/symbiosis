<?php

namespace App\Controller;

use App\Entity\Relationship;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class RelationshipTypesController
{
    #[Route('/api/relationship-types', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['types' => Relationship::TYPES]);
    }
}
