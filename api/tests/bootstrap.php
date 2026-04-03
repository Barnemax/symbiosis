<?php

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__).'/vendor/autoload.php';

if (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__).'/.env');
}

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
}

// Boot the kernel once to create the test schema before any test class runs.
$kernel = new App\Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
/** @var EntityManagerInterface $em */
$em = $kernel->getContainer()->get('doctrine')->getManager();
$tool = new SchemaTool($em);
$meta = $em->getMetadataFactory()->getAllMetadata();
$tool->dropSchema($meta);
$tool->createSchema($meta);
$kernel->shutdown();
