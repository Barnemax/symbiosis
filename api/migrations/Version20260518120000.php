<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260518120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add unique constraint on relationship (subject, object, type) to prevent duplicate edges';
    }

    public function up(Schema $schema): void
    {
        // Drop any pre-existing duplicates, keeping the lowest id per (subject, object, type) group.
        $this->addSql(<<<'SQL'
            DELETE FROM relationship r1
            USING relationship r2
            WHERE r1.id > r2.id
              AND r1.subject_id = r2.subject_id
              AND r1.object_id = r2.object_id
              AND r1.type = r2.type
            SQL);

        $this->addSql('CREATE UNIQUE INDEX UNIQ_relationship_subject_object_type ON relationship (subject_id, object_id, type)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_relationship_subject_object_type');
    }
}
