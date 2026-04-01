<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260401000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add species_translation table for localised habitat and substrate';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE species_translation (
            id SERIAL NOT NULL,
            species_id INT NOT NULL,
            locale VARCHAR(5) NOT NULL,
            habitat VARCHAR(255) DEFAULT NULL,
            substrate VARCHAR(200) DEFAULT NULL,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE UNIQUE INDEX uniq_species_translation_species_locale ON species_translation (species_id, locale)');
        $this->addSql('ALTER TABLE species_translation ADD CONSTRAINT fk_species_translation_species FOREIGN KEY (species_id) REFERENCES species (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE species_translation DROP CONSTRAINT fk_species_translation_species');
        $this->addSql('DROP TABLE species_translation');
    }
}
