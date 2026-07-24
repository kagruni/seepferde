<?php

declare(strict_types=1);

require_once __DIR__ . '/_working-equitation.php';

if (realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    we_submission_main();
}
