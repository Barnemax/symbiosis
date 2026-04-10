<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class EntityNotFoundException extends NotFoundHttpException
{
    public function __construct(string $entityName, int|string $id)
    {
        parent::__construct(sprintf('%s #%s not found.', $entityName, $id));
    }
}
