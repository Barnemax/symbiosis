<?php

namespace App\Repository;

use App\Entity\Species;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Species> */
class SpeciesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Species::class);
    }

    /** @return Species[] */
    public function findByKingdom(string $kingdom): array
    {
        return $this->createQueryBuilder('s')
            ->join('s.family', 'f')
            ->where('f.kingdom = :kingdom')
            ->setParameter('kingdom', $kingdom)
            ->getQuery()
            ->getResult();
    }
}
