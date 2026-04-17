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

    /** @return array<string, int> Map of kingdom value → species count */
    public function countByKingdom(): array
    {
        $rows = $this->createQueryBuilder('s')
            ->select('f.kingdom AS kingdom, COUNT(s.id) AS total')
            ->join('s.family', 'f')
            ->groupBy('f.kingdom')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($rows as $row) {
            $key = $row['kingdom'] instanceof \App\Enum\Kingdom ? $row['kingdom']->value : (string) $row['kingdom'];
            $counts[$key] = (int) $row['total'];
        }

        return $counts;
    }
}
