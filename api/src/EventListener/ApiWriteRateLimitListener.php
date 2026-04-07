<?php

namespace App\EventListener;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsEventListener(event: 'kernel.request', priority: 20)]
final readonly class ApiWriteRateLimitListener
{
    private const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public function __construct(
        #[Autowire(service: 'limiter.api_writes')]
        private RateLimiterFactory $apiWritesLimiter,
    ) {}

    public function __invoke(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if (!$event->isMainRequest()) {
            return;
        }

        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        if (!in_array($request->getMethod(), self::WRITE_METHODS, true)) {
            return;
        }

        $limiter = $this->apiWritesLimiter->create($request->getClientIp() ?? 'unknown');
        $limit = $limiter->consume();

        if (!$limit->isAccepted()) {
            throw new TooManyRequestsHttpException(
                $limit->getRetryAfter()->getTimestamp() - time(),
            );
        }
    }
}
