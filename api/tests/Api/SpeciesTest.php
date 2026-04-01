<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\CommonName;
use App\Entity\Family;
use App\Entity\Relationship;
use App\Entity\Species;
use Doctrine\ORM\EntityManagerInterface;

class SpeciesTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------

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

    private function createFamily(string $name = 'Corvidae', string $kingdom = 'bird'): Family
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $family = (new Family())->setName($name)->setKingdom($kingdom);
        $em->persist($family);
        $em->flush();

        return $family;
    }

    private function createSpecies(Family $family, string $scientificName = 'Garrulus glandarius'): Species
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $species = (new Species())->setScientificName($scientificName)->setFamily($family);
        $species->generateSlug();
        $em->persist($species);
        $em->flush();

        return $species;
    }

    private function addCommonName(Species $species, string $locale, string $name): void
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $cn = (new CommonName())->setSpecies($species)->setLocale($locale)->setName($name);
        $em->persist($cn);
        $em->flush();
    }

    private function createRelationship(Species $subject, Species $object, string $type): void
    {
        /** @var EntityManagerInterface $em */
        $em = static::getContainer()->get('doctrine')->getManager();
        $rel = (new Relationship())->setSubject($subject)->setObject($object)->setType($type);
        $em->persist($rel);
        $em->flush();
    }

    // ---------------------------------------------------------------------------
    // Tests
    // ---------------------------------------------------------------------------

    public function testGetCollectionReturnsJsonLd(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/species');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetCollectionContainsCreatedSpecies(): void
    {
        $family = $this->createFamily();
        $this->createSpecies($family);

        $client = static::createClient();
        $response = $client->request('GET', '/api/species');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame(1, $data['totalItems']);
        $this->assertSame('Garrulus glandarius', $data['member'][0]['scientificName']);
    }

    public function testFilterByKingdom(): void
    {
        $birdFamily = $this->createFamily('Corvidae', 'bird');
        $treeFamily = $this->createFamily('Fagaceae', 'tree');
        $this->createSpecies($birdFamily, 'Garrulus glandarius');
        $this->createSpecies($treeFamily, 'Quercus robur');

        $client = static::createClient();
        $response = $client->request('GET', '/api/species?family.kingdom=bird');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame(1, $data['totalItems']);
        $this->assertSame('Garrulus glandarius', $data['member'][0]['scientificName']);
    }

    public function testGetSingleSpecies(): void
    {
        $family = $this->createFamily();
        $species = $this->createSpecies($family);

        $client = static::createClient();
        $response = $client->request('GET', '/api/species/'.$species->getId());

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame('Garrulus glandarius', $data['scientificName']);
        $this->assertArrayHasKey('slug', $data);
    }

    public function testGetSingleSpeciesNotFound(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/species/99999');

        $this->assertResponseStatusCodeSame(404);
    }

    public function testPostWithoutApiKeyIsDenied(): void
    {
        $family = $this->createFamily();

        $client = static::createClient();
        $client->request('POST', '/api/species', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'scientificName' => 'Parus major',
                'family' => '/api/families/'.$family->getId(),
            ],
        ]);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testPostCreatesSpeciesWithCommonNames(): void
    {
        $family = $this->createFamily();

        $client = static::createClient();
        $client->request('POST', '/api/species', [
            'headers' => ['Content-Type' => 'application/ld+json', 'X-API-Key' => 'test-api-key'],
            'json' => [
                'scientificName' => 'Parus major',
                'family' => '/api/families/'.$family->getId(),
                'conservationStatus' => 'LC',
                'commonNames' => [
                    ['locale' => 'en', 'name' => 'Great Tit'],
                    ['locale' => 'fr', 'name' => 'Mésange charbonnière'],
                ],
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $data = $client->getResponse()->toArray();
        $this->assertSame('Parus major', $data['scientificName']);
        $this->assertSame('LC', $data['conservationStatus']);
        $this->assertCount(2, $data['commonNames']);
    }

    public function testPostRejectsInvalidConservationStatus(): void
    {
        $family = $this->createFamily();

        $client = static::createClient();
        $client->request('POST', '/api/species', [
            'headers' => ['Content-Type' => 'application/ld+json', 'X-API-Key' => 'test-api-key'],
            'json' => [
                'scientificName' => 'Parus major',
                'family' => '/api/families/'.$family->getId(),
                'conservationStatus' => 'INVALID',
            ],
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testPatchUpdatesScientificName(): void
    {
        $family = $this->createFamily();
        $species = $this->createSpecies($family);

        $client = static::createClient();
        $client->request('PATCH', '/api/species/'.$species->getId(), [
            'headers' => ['Content-Type' => 'application/merge-patch+json', 'X-API-Key' => 'test-api-key'],
            'json' => ['scientificName' => 'Corvus corax'],
        ]);

        $this->assertResponseIsSuccessful();
        $data = $client->getResponse()->toArray();
        $this->assertSame('Corvus corax', $data['scientificName']);
    }

    public function testSlugIsGeneratedOnCreate(): void
    {
        $family = $this->createFamily();

        $client = static::createClient();
        $client->request('POST', '/api/species', [
            'headers' => ['Content-Type' => 'application/ld+json', 'X-API-Key' => 'test-api-key'],
            'json' => [
                'scientificName' => 'Lophophanes cristatus',
                'family' => '/api/families/'.$family->getId(),
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $data = $client->getResponse()->toArray();
        $this->assertSame('lophophanes-cristatus', $data['slug']);
    }

    // ---------------------------------------------------------------------------
    // relationshipCount
    // ---------------------------------------------------------------------------

    public function testRelationshipCountIsZeroForIsolatedSpecies(): void
    {
        $family = $this->createFamily();
        $this->createSpecies($family);

        $response = static::createClient()->request('GET', '/api/species');

        $this->assertResponseIsSuccessful();
        $this->assertSame(0, $response->toArray()['member'][0]['relationshipCount']);
    }

    public function testRelationshipCountIncludesSubjectRelationships(): void
    {
        $birdFamily = $this->createFamily('Corvidae', 'bird');
        $treeFamily = $this->createFamily('Fagaceae', 'tree');
        $jay = $this->createSpecies($birdFamily, 'Garrulus glandarius');
        $oak = $this->createSpecies($treeFamily, 'Quercus robur');
        $this->createRelationship($jay, $oak, 'disperses_seeds_of');

        $response = static::createClient()->request('GET', '/api/species/'.$jay->getId());

        $this->assertResponseIsSuccessful();
        $this->assertSame(1, $response->toArray()['relationshipCount']);
    }

    public function testRelationshipCountIncludesObjectRelationships(): void
    {
        $birdFamily = $this->createFamily('Corvidae', 'bird');
        $treeFamily = $this->createFamily('Fagaceae', 'tree');
        $jay = $this->createSpecies($birdFamily, 'Garrulus glandarius');
        $oak = $this->createSpecies($treeFamily, 'Quercus robur');
        $this->createRelationship($jay, $oak, 'disperses_seeds_of');

        $response = static::createClient()->request('GET', '/api/species/'.$oak->getId());

        $this->assertResponseIsSuccessful();
        $this->assertSame(1, $response->toArray()['relationshipCount']);
    }

    public function testRelationshipCountSumsBothDirections(): void
    {
        $birdFamily = $this->createFamily('Corvidae', 'bird');
        $treeFamily = $this->createFamily('Fagaceae', 'tree');
        $fungusFamily = $this->createFamily('Boletaceae', 'fungus');
        $jay = $this->createSpecies($birdFamily, 'Garrulus glandarius');
        $oak = $this->createSpecies($treeFamily, 'Quercus robur');
        $bolete = $this->createSpecies($fungusFamily, 'Boletus edulis');
        $this->createRelationship($jay, $oak, 'disperses_seeds_of'); // oak is object (1)
        $this->createRelationship($bolete, $oak, 'mycorrhiza_with');   // oak is object (2)
        $this->createRelationship($oak, $jay, 'feeds_on');           // oak is subject (1)

        $response = static::createClient()->request('GET', '/api/species/'.$oak->getId());

        $this->assertResponseIsSuccessful();
        $this->assertSame(3, $response->toArray()['relationshipCount']);
    }

    // ---------------------------------------------------------------------------
    // Search filters
    // ---------------------------------------------------------------------------

    public function testSearchByCommonNameIsCaseInsensitive(): void
    {
        $family = $this->createFamily();
        $species = $this->createSpecies($family, 'Garrulus glandarius');
        $this->addCommonName($species, 'en', 'Eurasian Jay');

        $response = static::createClient()->request('GET', '/api/species?commonNames.name=eurasian');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame(1, $data['totalItems']);
        $this->assertSame('Garrulus glandarius', $data['member'][0]['scientificName']);
    }

    public function testSearchByCommonNameReturnsNoResultsOnMismatch(): void
    {
        $family = $this->createFamily();
        $species = $this->createSpecies($family);
        $this->addCommonName($species, 'en', 'Eurasian Jay');

        $response = static::createClient()->request('GET', '/api/species?commonNames.name=warbler');

        $this->assertResponseIsSuccessful();
        $this->assertSame(0, $response->toArray()['totalItems']);
    }

    public function testSearchByScientificNameIsCaseInsensitive(): void
    {
        $family = $this->createFamily();
        $this->createSpecies($family, 'Garrulus glandarius');
        $this->createSpecies($family, 'Parus major');

        $response = static::createClient()->request('GET', '/api/species?scientificName=garrulus');

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->assertSame(1, $data['totalItems']);
        $this->assertSame('Garrulus glandarius', $data['member'][0]['scientificName']);
    }

    // ---------------------------------------------------------------------------
    // Order filter
    // ---------------------------------------------------------------------------

    public function testOrderByScientificNameAscending(): void
    {
        $family = $this->createFamily();
        $this->createSpecies($family, 'Turdus merula');
        $this->createSpecies($family, 'Erithacus rubecula');
        $this->createSpecies($family, 'Parus major');

        $response = static::createClient()->request('GET', '/api/species?order[scientificName]=asc');

        $this->assertResponseIsSuccessful();
        $names = array_column($response->toArray()['member'], 'scientificName');
        $this->assertSame(['Erithacus rubecula', 'Parus major', 'Turdus merula'], $names);
    }

    public function testOrderByScientificNameDescending(): void
    {
        $family = $this->createFamily();
        $this->createSpecies($family, 'Turdus merula');
        $this->createSpecies($family, 'Erithacus rubecula');
        $this->createSpecies($family, 'Parus major');

        $response = static::createClient()->request('GET', '/api/species?order[scientificName]=desc');

        $this->assertResponseIsSuccessful();
        $names = array_column($response->toArray()['member'], 'scientificName');
        $this->assertSame(['Turdus merula', 'Parus major', 'Erithacus rubecula'], $names);
    }

    public function testOrderByRelationshipCountDescending(): void
    {
        $family = $this->createFamily();
        $jay     = $this->createSpecies($family, 'Garrulus glandarius');
        $robin   = $this->createSpecies($family, 'Erithacus rubecula');
        $warbler = $this->createSpecies($family, 'Phylloscopus sibilatrix');
        $tit     = $this->createSpecies($family, 'Parus major');

        // Jay: 3 links (subject ×2, object ×1)
        $this->createRelationship($jay, $robin, 'feeds_on');
        $this->createRelationship($jay, $warbler, 'nests_in');
        $this->createRelationship($tit, $jay, 'feeds_on');
        // Robin: 2 links (subject ×1, object ×1)
        $this->createRelationship($robin, $warbler, 'feeds_on');

        $response = static::createClient()->request('GET', '/api/species?order[relationshipCount]=desc');

        $this->assertResponseIsSuccessful();
        $members = $response->toArray()['member'];
        $counts = array_column($members, 'relationshipCount');
        // Strictly descending, each entry must be >= the next
        for ($i = 0; $i < count($counts) - 1; ++$i) {
            $this->assertGreaterThanOrEqual($counts[$i + 1], $counts[$i]);
        }
        // Jay has the most links (3), so it should be first
        $this->assertSame('Garrulus glandarius', $members[0]['scientificName']);
    }
}
