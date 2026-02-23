<?php

namespace App\EventListener;

use App\Entity\Relationship;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::postPersist)]
#[AsDoctrineListener(event: Events::postRemove)]
class RelationshipCountListener
{
    public function postPersist(PostPersistEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Relationship) {
            return;
        }

        $this->recalculate($entity, $args->getObjectManager());
    }

    public function postRemove(PostRemoveEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Relationship) {
            return;
        }

        $this->recalculate($entity, $args->getObjectManager());
    }

    private function recalculate(Relationship $relationship, \Doctrine\ORM\EntityManagerInterface $em): void
    {
        $conn = $em->getConnection();
        $sql = 'UPDATE species SET relationship_count = (
            SELECT COUNT(*) FROM relationship WHERE subject_id = species.id OR object_id = species.id
        ) WHERE id IN (?, ?)';

        $conn->executeStatement($sql, [
            $relationship->getSubject()?->getId(),
            $relationship->getObject()?->getId(),
        ]);
    }
}
