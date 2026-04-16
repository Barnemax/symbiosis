<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Family;
use App\Entity\Relationship;
use App\Entity\Species;
use Doctrine\ORM\EntityManagerInterface;

class RelationshipTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------

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

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private function createSpecies(string $scientificName, string $kingdom = 'bird'): Species
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $family = (new Family())->setName('Testaceae')->setKingdom($kingdom);
        $em->persist($family);
        $species = (new Species())->setScientificName($scientificName)->setFamily($family);
        $species->generateSlug();
        $em->persist($species);
        $em->flush();

        return $species;
    }

    private function createRelationship(Species $subject, Species $object, string $type): Relationship
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $rel = (new Relationship())
            ->setSubject($subject)
            ->setObject($object)
            ->setType($type);
        $em->persist($rel);
        $em->flush();

        return $rel;
    }

    // ---------------------------------------------------------------------------
    // Tests
    // ---------------------------------------------------------------------------

    public function testGetCollectionReturnsJsonLd(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/relationships');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testPostWithoutApiKeyIsDenied(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');

        $client = static::createClient();
        $client->request('POST', '/api/relationships', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'subject' => '/api/species/' . $bird->getId(),
                'object' => '/api/species/' . $tree->getId(),
                'type' => 'disperses_seeds_of',
            ],
        ]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPostCreatesRelationship(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');

        $client = static::createClient();
        $client->request('POST', '/api/relationships', [
            'headers' => ['Content-Type' => 'application/ld+json', 'X-API-Key' => 'test-api-key'],
            'json' => [
                'subject' => '/api/species/' . $bird->getId(),
                'object' => '/api/species/' . $tree->getId(),
                'type' => 'disperses_seeds_of',
                'notes' => 'Eurasian Jay buries acorns across forests.',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $data = $client->getResponse()->toArray();
        $this->assertSame('disperses_seeds_of', $data['type']);
        $this->assertSame('Eurasian Jay buries acorns across forests.', $data['notes']);
    }

    public function testPostRejectsInvalidType(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');

        $client = static::createClient();
        $client->request('POST', '/api/relationships', [
            'headers' => ['Content-Type' => 'application/ld+json', 'X-API-Key' => 'test-api-key'],
            'json' => [
                'subject' => '/api/species/' . $bird->getId(),
                'object' => '/api/species/' . $tree->getId(),
                'type' => 'unknown_type',
            ],
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testFilterByType(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');
        $fungus = $this->createSpecies('Boletus edulis', 'fungus');

        $this->createRelationship($bird, $tree, 'disperses_seeds_of');
        $this->createRelationship($tree, $fungus, 'mycorrhiza_with');

        $client = static::createClient();
        $response = $client->request('GET', '/api/relationships?type=mycorrhiza_with');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame(1, $data['totalItems']);
        $this->assertSame('mycorrhiza_with', $data['member'][0]['type']);
    }

    public function testPatchUpdatesNotes(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');
        $rel = $this->createRelationship($bird, $tree, 'disperses_seeds_of');

        $client = static::createClient();
        $client->request('PATCH', '/api/relationships/' . $rel->getId(), [
            'headers' => ['Content-Type' => 'application/merge-patch+json', 'X-API-Key' => 'test-api-key'],
            'json' => ['notes' => 'Updated notes.'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $client->getResponse()->toArray();
        $this->assertSame('Updated notes.', $data['notes']);
    }

    public function testRelationshipIncludesSubjectAndObjectDetails(): void
    {
        $bird = $this->createSpecies('Garrulus glandarius', 'bird');
        $tree = $this->createSpecies('Quercus robur', 'tree');
        $rel = $this->createRelationship($bird, $tree, 'nests_in');

        $client = static::createClient();
        $response = $client->request('GET', '/api/relationships/' . $rel->getId());

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame('Garrulus glandarius', $data['subject']['scientificName']);
        $this->assertSame('Quercus robur', $data['object']['scientificName']);
    }
}
