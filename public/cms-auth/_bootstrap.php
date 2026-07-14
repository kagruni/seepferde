<?php

declare(strict_types=1);

const CMS_AUTH_ISSUER = 'see-pferde-cms';
const CMS_GITHUB_API = 'https://api.github.com';
const CMS_GITHUB_API_VERSION = '2022-11-28';

/**
 * Resolve the private runtime configuration. The file must live outside the
 * web root so that a web-server configuration mistake cannot expose secrets.
 */
function cms_config_path(): string
{
    $configuredPath = trim((string) getenv('CMS_AUTH_CONFIG'));
    if ($configuredPath !== '') {
        return $configuredPath;
    }

    $home = trim((string) (getenv('HOME') ?: ($_SERVER['HOME'] ?? '')));
    if ($home === '' && function_exists('posix_getpwuid') && function_exists('posix_geteuid')) {
        $user = posix_getpwuid(posix_geteuid());
        $home = is_array($user) ? (string) ($user['dir'] ?? '') : '';
    }

    if ($home === '') {
        throw new RuntimeException('CMS_AUTH_CONFIG ist nicht gesetzt und das Benutzerverzeichnis konnte nicht ermittelt werden.');
    }

    return rtrim($home, DIRECTORY_SEPARATOR) . '/.config/seepferde-cms/config.php';
}

/** @return array<string, mixed> */
function cms_load_config(): array
{
    static $config = null;

    if (is_array($config)) {
        return $config;
    }

    $path = cms_config_path();
    $realPath = realpath($path);
    if ($realPath === false || !is_file($realPath) || !is_readable($realPath)) {
        throw new RuntimeException('Die private CMS-Konfiguration wurde nicht gefunden.');
    }

    $documentRoot = realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''));
    if ($documentRoot !== false && cms_path_is_inside($realPath, $documentRoot)) {
        throw new RuntimeException('Die private CMS-Konfiguration darf nicht im Webverzeichnis liegen.');
    }

    $loaded = require $realPath;
    if (!is_array($loaded)) {
        throw new RuntimeException('Die private CMS-Konfiguration muss ein PHP-Array zurückgeben.');
    }

    $requiredStrings = [
        'site_origin',
        'site_id',
        'repository',
        'branch',
        'username',
        'display_name',
        'password_hash',
        'session_secret',
        'github_app_id',
        'github_installation_id',
        'github_private_key_file',
    ];

    foreach ($requiredStrings as $key) {
        if (!isset($loaded[$key]) || !is_string($loaded[$key]) || trim($loaded[$key]) === '') {
            throw new RuntimeException(sprintf('Der Konfigurationswert „%s“ fehlt.', $key));
        }
        $loaded[$key] = trim($loaded[$key]);
    }

    $origin = parse_url($loaded['site_origin']);
    if (
        !is_array($origin)
        || ($origin['scheme'] ?? '') !== 'https'
        || empty($origin['host'])
        || isset($origin['path'])
        || isset($origin['query'])
        || isset($origin['fragment'])
    ) {
        throw new RuntimeException('site_origin muss eine reine HTTPS-Origin ohne Pfad sein.');
    }

    if (!preg_match('/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/', $loaded['repository'])) {
        throw new RuntimeException('repository muss im Format owner/repository angegeben werden.');
    }

    if (strlen($loaded['session_secret']) < 43) {
        throw new RuntimeException('session_secret muss mindestens 32 zufällige Bytes enthalten.');
    }

    $passwordInfo = password_get_info($loaded['password_hash']);
    if (($passwordInfo['algo'] ?? null) === null) {
        throw new RuntimeException('password_hash ist kein gültiger password_hash()-Wert.');
    }

    $privateKeyPath = realpath($loaded['github_private_key_file']);
    if ($privateKeyPath === false || !is_file($privateKeyPath) || !is_readable($privateKeyPath)) {
        throw new RuntimeException('Der private GitHub-App-Schlüssel wurde nicht gefunden oder ist nicht lesbar.');
    }
    if ($documentRoot !== false && cms_path_is_inside($privateKeyPath, $documentRoot)) {
        throw new RuntimeException('Der private GitHub-App-Schlüssel darf nicht im Webverzeichnis liegen.');
    }
    $loaded['github_private_key_file'] = $privateKeyPath;

    $loaded['_config_path'] = $realPath;
    $loaded['session_ttl_seconds'] = cms_bounded_int($loaded['session_ttl_seconds'] ?? 28800, 900, 43200);
    $loaded['max_request_bytes'] = cms_bounded_int($loaded['max_request_bytes'] ?? 8388608, 1048576, 12582912);
    $loaded['rate_limit_attempts'] = cms_bounded_int($loaded['rate_limit_attempts'] ?? 5, 3, 20);
    $loaded['rate_limit_window_seconds'] = cms_bounded_int($loaded['rate_limit_window_seconds'] ?? 900, 60, 3600);
    $loaded['rate_limit_lockout_seconds'] = cms_bounded_int($loaded['rate_limit_lockout_seconds'] ?? 900, 60, 86400);

    $config = $loaded;
    return $config;
}

function cms_bounded_int(mixed $value, int $minimum, int $maximum): int
{
    $number = filter_var($value, FILTER_VALIDATE_INT);
    if ($number === false || $number < $minimum || $number > $maximum) {
        throw new RuntimeException(sprintf('Ein Zahlenwert muss zwischen %d und %d liegen.', $minimum, $maximum));
    }
    return $number;
}

function cms_path_is_inside(string $path, string $directory): bool
{
    $normalizedPath = rtrim(str_replace('\\', '/', $path), '/');
    $normalizedDirectory = rtrim(str_replace('\\', '/', $directory), '/');
    return $normalizedPath === $normalizedDirectory || str_starts_with($normalizedPath, $normalizedDirectory . '/');
}

function cms_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function cms_base64url_decode(string $value): string|false
{
    $padding = (4 - strlen($value) % 4) % 4;
    return base64_decode(strtr($value . str_repeat('=', $padding), '-_', '+/'), true);
}

/** @param array<string, mixed> $config */
function cms_issue_session_token(array $config, ?int $now = null): string
{
    $issuedAt = $now ?? time();
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload = [
        'iss' => CMS_AUTH_ISSUER,
        'aud' => $config['site_id'],
        'sub' => $config['username'],
        'repo' => $config['repository'],
        'iat' => $issuedAt,
        'nbf' => $issuedAt - 5,
        'exp' => $issuedAt + (int) $config['session_ttl_seconds'],
        'jti' => cms_base64url_encode(random_bytes(18)),
    ];

    $parts = [
        cms_base64url_encode(json_encode($header, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES)),
        cms_base64url_encode(json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES)),
    ];
    $signature = hash_hmac('sha256', implode('.', $parts), $config['session_secret'], true);
    $parts[] = cms_base64url_encode($signature);

    return implode('.', $parts);
}

/**
 * @param array<string, mixed> $config
 * @return array<string, mixed>|null
 */
function cms_verify_session_token(string $token, array $config, ?int $now = null): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $signature = cms_base64url_decode($encodedSignature);
    if ($signature === false) {
        return null;
    }

    $expected = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $config['session_secret'], true);
    if (!hash_equals($expected, $signature)) {
        return null;
    }

    $headerJson = cms_base64url_decode($encodedHeader);
    $payloadJson = cms_base64url_decode($encodedPayload);
    if ($headerJson === false || $payloadJson === false) {
        return null;
    }

    try {
        $header = json_decode($headerJson, true, 8, JSON_THROW_ON_ERROR);
        $payload = json_decode($payloadJson, true, 16, JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        return null;
    }

    if (!is_array($header) || !is_array($payload) || ($header['alg'] ?? '') !== 'HS256') {
        return null;
    }

    $currentTime = $now ?? time();
    if (
        ($payload['iss'] ?? '') !== CMS_AUTH_ISSUER
        || ($payload['aud'] ?? '') !== $config['site_id']
        || ($payload['sub'] ?? '') !== $config['username']
        || ($payload['repo'] ?? '') !== $config['repository']
        || !is_int($payload['iat'] ?? null)
        || !is_int($payload['nbf'] ?? null)
        || !is_int($payload['exp'] ?? null)
        || $payload['iat'] > $currentTime + 60
        || $payload['nbf'] > $currentTime + 10
        || $payload['exp'] <= $currentTime
        || $payload['exp'] - $payload['iat'] > (int) $config['session_ttl_seconds'] + 10
    ) {
        return null;
    }

    return $payload;
}

function cms_authorization_token(): ?string
{
    $authorization = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if ($authorization === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authorization = is_array($headers) ? (string) ($headers['Authorization'] ?? $headers['authorization'] ?? '') : '';
    }

    if (!preg_match('/^(?:token|Bearer)\s+([^\s]+)$/i', trim($authorization), $matches)) {
        return null;
    }

    return $matches[1];
}

/** @param array<string, mixed> $config */
function cms_request_origin_is_allowed(array $config): bool
{
    $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
    return $origin === '' || hash_equals($config['site_origin'], rtrim($origin, '/'));
}

/** @param array<string, mixed> $config */
function cms_send_api_headers(array $config): void
{
    header('Access-Control-Allow-Origin: ' . $config['site_origin']);
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 600');
    header('Cache-Control: no-store');
    header('Referrer-Policy: no-referrer');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Vary: Origin');
}

function cms_json_response(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * The allowlist intentionally exposes only the GitHub endpoints Decap needs.
 * The session token is additionally locked to one configured repository.
 *
 * @param array<string, mixed> $config
 */
function cms_api_path_is_allowed(string $decodedPath, string $method, array $config): bool
{
    $path = ltrim($decodedPath, '/');
    if (
        $path === ''
        || str_contains($path, "\0")
        || str_contains($path, '\\')
        || preg_match('#(?:^|/)\.\.(?:/|$)#', $path)
        || preg_match('/%[0-9A-Fa-f]{2}/', $path)
    ) {
        return false;
    }

    if ($method === 'GET' && preg_match('/^users\/[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/', $path)) {
        return true;
    }

    $repoPrefix = 'repos/' . $config['repository'];
    if (strcasecmp($path, $repoPrefix) === 0) {
        return $method === 'GET';
    }

    if (strncasecmp($path, $repoPrefix . '/', strlen($repoPrefix) + 1) !== 0) {
        return false;
    }

    $resourcePath = substr($path, strlen($repoPrefix) + 1);
    $resource = strtolower((string) strtok($resourcePath, '/'));
    $allowedResources = [
        'git',
        'contents',
        'pulls',
        'branches',
        'merges',
        'statuses',
        'compare',
        'commits',
        'issues',
    ];

    return in_array($resource, $allowedResources, true)
        && in_array($method, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], true);
}

/**
 * @return array{raw: string, decoded: string}
 */
function cms_requested_api_path(): array
{
    $requestPath = (string) (parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH) ?? '');
    $marker = '/cms-auth/repository/';
    $position = strpos($requestPath, $marker);

    if ($position !== false) {
        $raw = substr($requestPath, $position + strlen($marker));
    } else {
        $raw = ltrim((string) ($_GET['path'] ?? ''), '/');
        $raw = implode('/', array_map('rawurlencode', explode('/', rawurldecode($raw))));
    }

    $decoded = rawurldecode($raw);
    return ['raw' => ltrim($raw, '/'), 'decoded' => ltrim($decoded, '/')];
}

/** @param array<string, mixed> $config */
function cms_github_app_jwt(array $config, ?int $now = null): string
{
    $issuedAt = $now ?? time();
    $header = ['alg' => 'RS256', 'typ' => 'JWT'];
    $payload = [
        'iat' => $issuedAt - 60,
        'exp' => $issuedAt + 540,
        'iss' => $config['github_app_id'],
    ];
    $unsigned = cms_base64url_encode(json_encode($header, JSON_THROW_ON_ERROR))
        . '.'
        . cms_base64url_encode(json_encode($payload, JSON_THROW_ON_ERROR));

    $privateKeyPath = realpath($config['github_private_key_file']);
    if ($privateKeyPath === false || !is_readable($privateKeyPath)) {
        throw new RuntimeException('Der private GitHub-App-Schlüssel ist nicht lesbar.');
    }

    $privateKey = openssl_pkey_get_private('file://' . $privateKeyPath);
    if ($privateKey === false) {
        throw new RuntimeException('Der private GitHub-App-Schlüssel ist ungültig.');
    }

    $signature = '';
    if (!openssl_sign($unsigned, $signature, $privateKey, OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Das GitHub-App-Token konnte nicht signiert werden.');
    }

    return $unsigned . '.' . cms_base64url_encode($signature);
}

/** @param array<string, mixed> $config */
function cms_github_installation_token(array $config): string
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('Die PHP-cURL-Erweiterung ist für den CMS-Zugriff erforderlich.');
    }

    $cacheFile = (string) ($config['github_token_cache_file'] ?? (dirname($config['_config_path']) . '/cache/github-installation-token.json'));
    $cacheDirectory = dirname($cacheFile);
    if (!is_dir($cacheDirectory) && !mkdir($cacheDirectory, 0700, true) && !is_dir($cacheDirectory)) {
        throw new RuntimeException('Das private CMS-Cacheverzeichnis konnte nicht erstellt werden.');
    }

    $handle = fopen($cacheFile, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Der private CMS-Token-Cache konnte nicht geöffnet werden.');
    }
    @chmod($cacheFile, 0600);

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Der CMS-Token-Cache konnte nicht gesperrt werden.');
        }

        rewind($handle);
        $cachedJson = stream_get_contents($handle);
        $cached = is_string($cachedJson) && $cachedJson !== '' ? json_decode($cachedJson, true) : null;
        if (
            is_array($cached)
            && is_string($cached['token'] ?? null)
            && is_int($cached['expires_at'] ?? null)
            && $cached['expires_at'] > time() + 300
        ) {
            return $cached['token'];
        }

        $parts = explode('/', $config['repository'], 2);
        $payload = json_encode([
            'repositories' => [$parts[1]],
            'permissions' => [
                'contents' => 'write',
                'pull_requests' => 'write',
                'issues' => 'write',
                'statuses' => 'read',
            ],
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

        $url = CMS_GITHUB_API . '/app/installations/' . rawurlencode($config['github_installation_id']) . '/access_tokens';
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_HTTPHEADER => [
                'Accept: application/vnd.github+json',
                'Authorization: Bearer ' . cms_github_app_jwt($config),
                'Content-Type: application/json',
                'User-Agent: See-Pferde-CMS-Gateway/1.0',
                'X-GitHub-Api-Version: ' . CMS_GITHUB_API_VERSION,
            ],
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);

        if (!is_string($response) || $status < 200 || $status >= 300) {
            throw new RuntimeException('GitHub hat die Erstellung des kurzlebigen Zugriffstokens abgelehnt.' . ($error !== '' ? ' ' . $error : ''));
        }

        $data = json_decode($response, true, 16, JSON_THROW_ON_ERROR);
        $token = is_array($data) ? ($data['token'] ?? null) : null;
        $expiresAt = is_array($data) ? strtotime((string) ($data['expires_at'] ?? '')) : false;
        if (!is_string($token) || $token === '' || $expiresAt === false) {
            throw new RuntimeException('GitHub hat ein unvollständiges Zugriffstoken geliefert.');
        }

        $cachePayload = json_encode(['token' => $token, 'expires_at' => $expiresAt], JSON_THROW_ON_ERROR);
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, $cachePayload);
        fflush($handle);

        return $token;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** @param array<string, mixed> $config */
function cms_rate_limit_file(array $config, string $username): string
{
    $directory = (string) ($config['rate_limit_directory'] ?? (dirname($config['_config_path']) . '/rate-limits'));
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Das private CMS-Rate-Limit-Verzeichnis konnte nicht erstellt werden.');
    }

    $remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = hash_hmac('sha256', strtolower(trim($username)) . '|' . $remoteAddress, $config['session_secret']);
    return rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $key . '.json';
}

/** @param array<string, mixed> $config */
function cms_rate_limit_is_blocked(array $config, string $username, ?int $now = null): bool
{
    $currentTime = $now ?? time();
    $state = cms_rate_limit_update($config, $username, static function (array $state) use ($config, $currentTime): array {
        $windowStart = $currentTime - (int) $config['rate_limit_window_seconds'];
        $state['failures'] = array_values(array_filter(
            is_array($state['failures'] ?? null) ? $state['failures'] : [],
            static fn (mixed $timestamp): bool => is_int($timestamp) && $timestamp >= $windowStart,
        ));
        return $state;
    });

    return is_int($state['locked_until'] ?? null) && $state['locked_until'] > $currentTime;
}

/** @param array<string, mixed> $config */
function cms_rate_limit_record_failure(array $config, string $username, ?int $now = null): void
{
    $currentTime = $now ?? time();
    cms_rate_limit_update($config, $username, static function (array $state) use ($config, $currentTime): array {
        $windowStart = $currentTime - (int) $config['rate_limit_window_seconds'];
        $failures = array_values(array_filter(
            is_array($state['failures'] ?? null) ? $state['failures'] : [],
            static fn (mixed $timestamp): bool => is_int($timestamp) && $timestamp >= $windowStart,
        ));
        $failures[] = $currentTime;
        $state['failures'] = $failures;
        if (count($failures) >= (int) $config['rate_limit_attempts']) {
            $state['locked_until'] = $currentTime + (int) $config['rate_limit_lockout_seconds'];
        }
        return $state;
    });
}

/** @param array<string, mixed> $config */
function cms_rate_limit_clear(array $config, string $username): void
{
    $file = cms_rate_limit_file($config, $username);
    if (is_file($file)) {
        @unlink($file);
    }
}

/**
 * @param array<string, mixed> $config
 * @param callable(array<string, mixed>): array<string, mixed> $callback
 * @return array<string, mixed>
 */
function cms_rate_limit_update(array $config, string $username, callable $callback): array
{
    $file = cms_rate_limit_file($config, $username);
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        throw new RuntimeException('Das CMS-Rate-Limit konnte nicht geöffnet werden.');
    }
    @chmod($file, 0600);

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('Das CMS-Rate-Limit konnte nicht gesperrt werden.');
        }
        rewind($handle);
        $json = stream_get_contents($handle);
        $state = is_string($json) && $json !== '' ? json_decode($json, true) : [];
        $state = is_array($state) ? $state : [];
        $state = $callback($state);

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($state, JSON_THROW_ON_ERROR));
        fflush($handle);
        return $state;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
