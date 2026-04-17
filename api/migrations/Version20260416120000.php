<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260416120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add dtype discriminator to species for Single Table Inheritance (BirdSpecies, TreeSpecies, FungusSpecies)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species ADD dtype VARCHAR(20)');
        $this->addSql('UPDATE species s SET dtype = f.kingdom FROM family f WHERE s.family_id = f.id');
        $this->addSql('ALTER TABLE species ALTER COLUMN dtype SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species DROP COLUMN dtype');
    }
}
