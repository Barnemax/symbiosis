<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260324100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add denormalized relationship_count column to species';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species ADD relationship_count INT DEFAULT 0 NOT NULL');
        // Backfill existing counts
        $this->addSql('UPDATE species SET relationship_count = (
            SELECT COUNT(*) FROM relationship WHERE subject_id = species.id OR object_id = species.id
        )');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species DROP COLUMN relationship_count');
    }
}
