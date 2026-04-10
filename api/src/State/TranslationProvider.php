<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Locale;
use App\Exception\EntityNotFoundException;
use App\Exception\InvalidLocaleException;
use Doctrine\ORM\EntityManagerInterface;

/** @implements ProviderInterface<object> */
final class TranslationProvider implements ProviderInterface
{
    public function __construct(private readonly EntityManagerInterface $em) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object
    {
        $locale = $uriVariables['locale'];
        if (!in_array($locale, Locale::SUPPORTED, true)) {
            throw new InvalidLocaleException($locale);
        }

        $extra = $operation->getExtraProperties();
        $parentClass = $extra['parentClass'];
        $parentProperty = $extra['parentProperty'];

        /** @var object|null $parent */
        $parent = $this->em->find($parentClass, $uriVariables[$parentProperty . 'Id']); // @phpstan-ignore argument.templateType
        if (!$parent) {
            throw new EntityNotFoundException(ucfirst($parentProperty), $uriVariables[$parentProperty . 'Id']);
        }

        $translationClass = $operation->getClass();
        $translation = $this->em->getRepository($translationClass)
            ->findOneBy([$parentProperty => $parent, 'locale' => $locale]);

        if ($translation === null) {
            $translation = new $translationClass();
            $translation->{'set' . ucfirst($parentProperty)}($parent);
            $translation->setLocale($locale);
        }

        return $translation;
    }
}
