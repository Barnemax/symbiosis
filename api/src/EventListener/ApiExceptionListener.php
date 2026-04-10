<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

/**
 * Normalizes all API exceptions into a consistent JSON shape:
 *
 *   { "error": "snake_case_class", "message": "…", "status": 4xx }
 */
#[AsEventListener(event: 'kernel.exception')]
final class ApiExceptionListener
{
    public function __invoke(ExceptionEvent $event): void
    {
        $request = $event->getRequest();

        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $throwable = $event->getThrowable();
        $status = $throwable instanceof HttpExceptionInterface
            ? $throwable->getStatusCode()
            : 500;

        $headers = $throwable instanceof HttpExceptionInterface ? $throwable->getHeaders() : [];
        $headers['Content-Type'] = 'application/problem+json; charset=utf-8';

        $event->setResponse(new JsonResponse([
            'error' => $this->errorCode($throwable),
            'message' => $throwable->getMessage(),
            'status' => $status,
        ], $status, $headers, false));
    }

    /**
     * Derives a stable error code from the exception class name.
     * App\Exception\RateLimitExceededException → "rate_limit_exceeded"
     */
    private function errorCode(\Throwable $throwable): string
    {
        $short = (new \ReflectionClass($throwable))->getShortName();
        $short = preg_replace('/Exception$/', '', $short);

        // PascalCase → snake_case
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $short));
    }
}
