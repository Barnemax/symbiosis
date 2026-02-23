<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260308120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add slug to species';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species ADD slug VARCHAR(200) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_species_slug ON species (slug)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_species_slug');
        $this->addSql('ALTER TABLE species DROP COLUMN slug');
    }
}
