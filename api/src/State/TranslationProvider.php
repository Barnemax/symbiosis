<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Locale;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/** @implements ProviderInterface<object> */
final class TranslationProvider implements ProviderInterface
{
    public function __construct(private readonly EntityManagerInterface $em) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object
    {
        $locale = $uriVariables['locale'];
        if (!in_array($locale, Locale::SUPPORTED, true)) {
            throw new NotFoundHttpException(sprintf('Invalid locale "%s".', $locale));
        }

        $extra = $operation->getExtraProperties();
        $parentClass = $extra['parentClass'];
        $parentProperty = $extra['parentProperty'];

        /** @var object|null $parent */
        $parent = $this->em->find($parentClass, $uriVariables[$parentProperty . 'Id']); // @phpstan-ignore argument.templateType
        if (!$parent) {
            throw new NotFoundHttpException(ucfirst($parentProperty) . ' not found.');
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
