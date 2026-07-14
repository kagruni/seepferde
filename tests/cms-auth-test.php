<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/public/cms-auth/_bootstrap.php';

$assertions = 0;

function assert_true(bool $condition, string $message): void
{
    global $assertions;
    $assertions++;
    if (!$condition) {
        throw new RuntimeException('Fehlgeschlagen: ' . $message);
    }
}

function remove_tree(string $path): void
{
    if (!is_dir($path)) {
        @unlink($path);
        return;
    }
    foreach (scandir($path) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        remove_tree($path . DIRECTORY_SEPARATOR . $entry);
    }
    rmdir($path);
}

$temporaryDirectory = sys_get_temp_dir() . '/see-pferde-cms-test-' . bin2hex(random_bytes(6));
mkdir($temporaryDirectory, 0700, true);

try {
    $config = [
        'site_origin' => 'https://mandykolatka.kajik.dev',
        'site_id' => 'mandykolatka.kajik.dev',
        'repository' => 'kagruni/seepferde',
        'branch' => 'main',
        'username' => 'mandy',
        'display_name' => 'Mandy Kolatka',
        'session_secret' => cms_base64url_encode(random_bytes(48)),
        'session_ttl_seconds' => 3600,
        'rate_limit_attempts' => 3,
        'rate_limit_window_seconds' => 900,
        'rate_limit_lockout_seconds' => 900,
        'rate_limit_directory' => $temporaryDirectory . '/rate-limits',
        '_config_path' => $temporaryDirectory . '/config.php',
    ];

    $now = 1_800_000_000;
    $token = cms_issue_session_token($config, $now);
    $claims = cms_verify_session_token($token, $config, $now + 30);
    assert_true(is_array($claims), 'Ein gültiges Sitzungstoken wird akzeptiert.');
    assert_true(($claims['sub'] ?? null) === 'mandy', 'Das Sitzungstoken ist an den CMS-Benutzer gebunden.');
    assert_true(($claims['repo'] ?? null) === 'kagruni/seepferde', 'Das Sitzungstoken ist an genau ein Repository gebunden.');
    assert_true(cms_verify_session_token($token . 'x', $config, $now + 30) === null, 'Manipulierte Tokens werden abgelehnt.');
    assert_true(cms_verify_session_token($token, $config, $now + 3601) === null, 'Abgelaufene Tokens werden abgelehnt.');

    assert_true(cms_api_path_is_allowed('repos/kagruni/seepferde', 'GET', $config), 'Der konfigurierte Repository-Status darf gelesen werden.');
    assert_true(!cms_api_path_is_allowed('repos/kagruni/seepferde', 'POST', $config), 'Die Repository-Wurzel darf nicht beschrieben werden.');
    assert_true(cms_api_path_is_allowed('repos/kagruni/seepferde/git/blobs', 'POST', $config), 'CMS-Git-Objekte dürfen angelegt werden.');
    assert_true(cms_api_path_is_allowed('repos/kagruni/seepferde/pulls/12/merge', 'PUT', $config), 'Der Redaktionsablauf darf Pull Requests mergen.');
    assert_true(cms_api_path_is_allowed('users/see-pferde-cms', 'GET', $config), 'Öffentliche Autorinformationen dürfen gelesen werden.');
    assert_true(!cms_api_path_is_allowed('repos/other/private-repo/contents', 'GET', $config), 'Andere Repositories werden abgelehnt.');
    assert_true(!cms_api_path_is_allowed('repos/kagruni/seepferde/actions/secrets', 'GET', $config), 'Nicht benötigte GitHub-Endpunkte werden abgelehnt.');
    assert_true(!cms_api_path_is_allowed('repos/kagruni/seepferde/../other', 'GET', $config), 'Pfadtraversierung wird abgelehnt.');
    assert_true(!cms_api_path_is_allowed('repos/kagruni/seepferde/%2e%2e/other', 'GET', $config), 'Doppelt kodierte Pfadtraversierung wird abgelehnt.');

    $_SERVER['REMOTE_ADDR'] = '192.0.2.25';
    assert_true(!cms_rate_limit_is_blocked($config, 'mandy', $now), 'Ein neuer Benutzer ist nicht gesperrt.');
    cms_rate_limit_record_failure($config, 'mandy', $now);
    cms_rate_limit_record_failure($config, 'mandy', $now + 1);
    assert_true(!cms_rate_limit_is_blocked($config, 'mandy', $now + 2), 'Weniger als drei Fehlversuche sperren den Zugang nicht.');
    cms_rate_limit_record_failure($config, 'mandy', $now + 2);
    assert_true(cms_rate_limit_is_blocked($config, 'mandy', $now + 3), 'Die konfigurierte Fehlversuchsgrenze sperrt den Zugang.');
    cms_rate_limit_clear($config, 'mandy');
    assert_true(!cms_rate_limit_is_blocked($config, 'mandy', $now + 4), 'Eine erfolgreiche Anmeldung hebt die Sperre auf.');

    $keyResource = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
    assert_true($keyResource !== false, 'Ein Testschlüssel kann erzeugt werden.');
    $privateKey = '';
    openssl_pkey_export($keyResource, $privateKey);
    $privateKeyPath = $temporaryDirectory . '/github-app.pem';
    file_put_contents($privateKeyPath, $privateKey);
    $appConfig = $config + [
        'github_app_id' => '123456',
        'github_private_key_file' => $privateKeyPath,
    ];
    $appToken = cms_github_app_jwt($appConfig, $now);
    $appParts = explode('.', $appToken);
    assert_true(count($appParts) === 3, 'Das GitHub-App-JWT hat drei Bestandteile.');
    $publicKeyDetails = openssl_pkey_get_details($keyResource);
    $verified = openssl_verify(
        $appParts[0] . '.' . $appParts[1],
        cms_base64url_decode($appParts[2]),
        $publicKeyDetails['key'],
        OPENSSL_ALGO_SHA256,
    );
    assert_true($verified === 1, 'Das GitHub-App-JWT ist mit dem privaten App-Schlüssel signiert.');

    echo sprintf("CMS-Authentifizierung: %d Prüfungen erfolgreich.\n", $assertions);
} finally {
    remove_tree($temporaryDirectory);
}

