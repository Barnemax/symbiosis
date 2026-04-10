<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

final class RateLimitExceededException extends TooManyRequestsHttpException
{
    public function __construct(int $retryAfterSeconds)
    {
        parent::__construct($retryAfterSeconds, 'API write rate limit exceeded.');
    }
}
