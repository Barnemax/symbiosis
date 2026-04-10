<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class InvalidLocaleException extends NotFoundHttpException
{
    public function __construct(string $locale)
    {
        parent::__construct(sprintf('Invalid locale "%s".', $locale));
    }
}
