<?php

declare(strict_types=1);

// Copy this file to ~/.config/seepferde-cms/config.php on the cPanel account.
// Never place the completed file inside public_html or commit real secrets.
return [
    'site_origin' => 'https://mandykolatka.kajik.dev',
    'site_id' => 'mandykolatka.kajik.dev',
    'repository' => 'kagruni/seepferde',
    'branch' => 'main',

    'username' => 'mandy',
    'display_name' => 'Mandy Kolatka',
    'password_hash' => 'REPLACE_WITH_PASSWORD_HASH',
    'session_secret' => 'REPLACE_WITH_AT_LEAST_32_RANDOM_BYTES_AS_BASE64URL',
    'session_ttl_seconds' => 28800,

    'github_app_id' => 'REPLACE_WITH_GITHUB_APP_ID',
    'github_installation_id' => 'REPLACE_WITH_INSTALLATION_ID',
    'github_private_key_file' => '/home/CPANEL_USER/.config/seepferde-cms/github-app.pem',

    'rate_limit_attempts' => 5,
    'rate_limit_window_seconds' => 900,
    'rate_limit_lockout_seconds' => 900,
    'max_request_bytes' => 8388608,
];

