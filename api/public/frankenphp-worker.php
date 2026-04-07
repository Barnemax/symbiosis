<?php

require_once dirname(__DIR__).'/vendor/autoload.php';

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

$kernel = new Kernel($env = $_SERVER['APP_ENV'] ?? 'prod', (bool) ($_SERVER['APP_DEBUG'] ?? false));

$t = hrtime(true);
error_log("[worker] Booting kernel ({$env})...");
$kernel->boot();
error_log(sprintf('[worker] Kernel ready in %.1fs — accepting requests', (hrtime(true) - $t) / 1e9));

$handler = static function () use ($kernel): void {
    $request = Request::createFromGlobals();
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);

    $container = $kernel->getContainer();
    if ($container->has('services_resetter')) {
        $container->get('services_resetter')->reset();
    }
};

$maxRequests = (int) ($_SERVER['FRANKENPHP_MAX_REQUESTS'] ?? 500);
for ($i = 1; frankenphp_handle_request($handler); $i++) {
    if ($i >= $maxRequests) {
        break;
    }
    gc_collect_cycles();
}

error_log(sprintf('[worker] Recycling after %d requests', $i));
