<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260402000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add relationship_translation table for localised notes';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE relationship_translation (
            id SERIAL NOT NULL,
            relationship_id INT NOT NULL,
            locale VARCHAR(5) NOT NULL,
            notes TEXT DEFAULT NULL,
            PRIMARY KEY(id)
        )');
        $this->addSql('CREATE UNIQUE INDEX uniq_relationship_translation_rel_locale ON relationship_translation (relationship_id, locale)');
        $this->addSql('ALTER TABLE relationship_translation ADD CONSTRAINT fk_relationship_translation_relationship FOREIGN KEY (relationship_id) REFERENCES relationship (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE relationship_translation DROP CONSTRAINT fk_relationship_translation_relationship');
        $this->addSql('DROP TABLE relationship_translation');
    }
}
