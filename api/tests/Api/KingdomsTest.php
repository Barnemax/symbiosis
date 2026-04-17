<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Family;
use App\Entity\Kingdoms\BirdSpecies;
use App\Entity\Kingdoms\FungusSpecies;
use App\Entity\Kingdoms\TreeSpecies;
use App\Enum\Kingdom;
use Doctrine\ORM\EntityManagerInterface;

class KingdomsTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    protected function setUp(): void
    {
        static::getContainer()->get('cache.app')->clear();
    }

    protected function tearDown(): void
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $conn = $em->getConnection();
        $conn->executeStatement('TRUNCATE relationship_translation, species_translation, relationship, common_name, media, species, family RESTART IDENTITY CASCADE');
        parent::tearDown();
    }

    private function seedSpecies(Kingdom $kingdom, int $n): void
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $family = (new Family())->setName('Fam_' . $kingdom->value)->setKingdom($kingdom);
        $em->persist($family);
        for ($i = 0; $i < $n; ++$i) {
            $species = match ($kingdom) {
                Kingdom::Bird => new BirdSpecies(),
                Kingdom::Tree => new TreeSpecies(),
                Kingdom::Fungus => new FungusSpecies(),
            };
            $species->setScientificName($kingdom->value . ' species ' . $i)->setFamily($family);
            $species->generateSlug();
            $em->persist($species);
        }
        $em->flush();
    }

    public function testReturnsAllKingdomCases(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/kingdoms');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('kingdoms', $data);
        $this->assertCount(count(Kingdom::cases()), $data['kingdoms']);

        $keys = array_column($data['kingdoms'], 'key');
        foreach (Kingdom::cases() as $k) {
            $this->assertContains($k->value, $keys);
        }
    }

    public function testEachEntryExposesKeyPluralSlugCount(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/kingdoms');

        $data = json_decode($client->getResponse()->getContent(), true);
        $byKey = array_column($data['kingdoms'], null, 'key');

        foreach (Kingdom::cases() as $k) {
            $entry = $byKey[$k->value];
            $this->assertSame($k->value, $entry['key']);
            $this->assertSame($k->plural(), $entry['plural']);
            $this->assertSame($k->slug(), $entry['slug']);
            $this->assertArrayHasKey('count', $entry);
            $this->assertIsInt($entry['count']);
        }
    }

    public function testCountsReflectSeededSpecies(): void
    {
        $this->seedSpecies(Kingdom::Bird, 3);
        $this->seedSpecies(Kingdom::Tree, 2);
        $this->seedSpecies(Kingdom::Fungus, 5);

        $client = static::createClient();
        $client->request('GET', '/api/kingdoms');

        $data = json_decode($client->getResponse()->getContent(), true);
        $byKey = array_column($data['kingdoms'], null, 'key');

        $this->assertSame(3, $byKey['bird']['count']);
        $this->assertSame(2, $byKey['tree']['count']);
        $this->assertSame(5, $byKey['fungus']['count']);
    }

    public function testCountIsZeroForKingdomWithoutSpecies(): void
    {
        $this->seedSpecies(Kingdom::Bird, 1);

        $client = static::createClient();
        $client->request('GET', '/api/kingdoms');

        $data = json_decode($client->getResponse()->getContent(), true);
        $byKey = array_column($data['kingdoms'], null, 'key');

        $this->assertSame(1, $byKey['bird']['count']);
        $this->assertSame(0, $byKey['tree']['count']);
        $this->assertSame(0, $byKey['fungus']['count']);
    }
}
