<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class RateLimitTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    protected function setUp(): void
    {
        static::getContainer()->get('cache.app')->clear();
    }

    public function testGetRequestsAreNotRateLimited(): void
    {
        $client = static::createClient();

        for ($i = 0; $i < 25; ++$i) {
            $client->request('GET', '/api/species');
        }

        $this->assertResponseIsSuccessful();
    }

    public function testWriteRequestsAreRateLimitedAt20PerMinute(): void
    {
        $client = static::createClient();

        for ($i = 0; $i < 20; ++$i) {
            $client->request('POST', '/api/species', [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => ['scientificName' => 'Test'],
            ]);
            // 401 (no API key) is expected — rate limiter runs before auth
            $this->assertContains(
                $client->getResponse()->getStatusCode(),
                [401, 422],
                "Request $i should not be rate-limited",
            );
        }

        // Request 21 should be throttled
        $client->request('POST', '/api/species', [
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => ['scientificName' => 'Test'],
        ]);

        $this->assertResponseStatusCodeSame(429);
    }

    public function testRateLimitAppliesToAllWriteMethods(): void
    {
        $client = static::createClient();

        // Exhaust the limit with mixed write methods
        for ($i = 0; $i < 10; ++$i) {
            $client->request('POST', '/api/species', [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [],
            ]);
        }
        for ($i = 0; $i < 10; ++$i) {
            $client->request('PATCH', '/api/species/1', [
                'headers' => ['Content-Type' => 'application/merge-patch+json'],
                'json' => [],
            ]);
        }

        // 21st write via PATCH should be throttled
        $client->request('PATCH', '/api/species/1', [
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
            'json' => [],
        ]);

        $this->assertResponseStatusCodeSame(429);
    }

    public function testRateLimitResponseIncludesRetryAfter(): void
    {
        $client = static::createClient();

        for ($i = 0; $i < 21; ++$i) {
            $client->request('POST', '/api/species', [
                'headers' => ['Content-Type' => 'application/ld+json'],
                'json' => [],
            ]);
        }

        $this->assertResponseStatusCodeSame(429);
        $this->assertResponseHeaderSame('content-type', 'application/problem+json; charset=utf-8');

        $headers = $client->getResponse()->getHeaders(false);
        $this->assertArrayHasKey('retry-after', $headers);
        $this->assertGreaterThan(0, (int) $headers['retry-after'][0]);
    }
}
