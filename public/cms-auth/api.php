<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

/** @return array<string, string> */
function cms_client_headers(): array
{
    $headers = [
        'Accept' => (string) ($_SERVER['HTTP_ACCEPT'] ?? 'application/vnd.github+json'),
    ];

    $contentType = trim((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if ($contentType !== '') {
        $headers['Content-Type'] = $contentType;
    }

    return $headers;
}

function cms_proxy_query_string(): string
{
    $query = $_GET;
    unset($query['path']);
    return http_build_query($query, '', '&', PHP_QUERY_RFC3986);
}

/**
 * @param array<string, mixed> $config
 * @return array{status: int, headers: array<string, list<string>>, body: string}
 */
function cms_proxy_github_request(
    array $config,
    string $method,
    string $rawPath,
    string $body,
    bool $allowRetry = true,
): array {
    $query = cms_proxy_query_string();
    $url = CMS_GITHUB_API . '/' . ltrim($rawPath, '/') . ($query !== '' ? '?' . $query : '');
    $installationToken = cms_github_installation_token($config);
    $responseHeaders = [];

    $outgoingHeaders = [
        'Accept: ' . cms_client_headers()['Accept'],
        'Authorization: Bearer ' . $installationToken,
        'User-Agent: See-Pferde-CMS-Gateway/1.0',
        'X-GitHub-Api-Version: ' . CMS_GITHUB_API_VERSION,
    ];
    $clientHeaders = cms_client_headers();
    if (isset($clientHeaders['Content-Type'])) {
        $outgoingHeaders[] = 'Content-Type: ' . $clientHeaders['Content-Type'];
    }

    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 45,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => $outgoingHeaders,
        CURLOPT_HEADERFUNCTION => static function ($handle, string $line) use (&$responseHeaders): int {
            $length = strlen($line);
            $trimmed = trim($line);
            if ($trimmed === '' || !str_contains($trimmed, ':')) {
                return $length;
            }
            [$name, $value] = explode(':', $trimmed, 2);
            $key = strtolower(trim($name));
            $responseHeaders[$key] ??= [];
            $responseHeaders[$key][] = trim($value);
            return $length;
        },
    ]);

    if (!in_array($method, ['GET', 'HEAD'], true)) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
    }

    $responseBody = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if (!is_string($responseBody)) {
        throw new RuntimeException('Die Verbindung zum Inhalts-Repository ist fehlgeschlagen. ' . $error);
    }

    if ($status === 401 && $allowRetry) {
        $cacheFile = (string) ($config['github_token_cache_file'] ?? (dirname($config['_config_path']) . '/cache/github-installation-token.json'));
        @unlink($cacheFile);
        return cms_proxy_github_request($config, $method, $rawPath, $body, false);
    }

    return ['status' => $status, 'headers' => $responseHeaders, 'body' => $responseBody];
}

/** @param array<string, mixed> $config */
function cms_rewrite_github_url(string $value, array $config): string
{
    return str_replace(CMS_GITHUB_API, $config['site_origin'] . '/cms-auth/repository', $value);
}

/** @param array<string, mixed> $config */
function cms_rewrite_json_urls(mixed $value, array $config): mixed
{
    if (is_string($value)) {
        return cms_rewrite_github_url($value, $config);
    }
    if (!is_array($value)) {
        return $value;
    }
    foreach ($value as $key => $item) {
        $value[$key] = cms_rewrite_json_urls($item, $config);
    }
    return $value;
}

/**
 * @param array<string, mixed> $config
 * @param array{status: int, headers: array<string, list<string>>, body: string} $response
 */
function cms_emit_github_response(array $config, array $response, string $decodedPath, string $method): never
{
    $body = $response['body'];
    $contentType = $response['headers']['content-type'][0] ?? 'application/json; charset=utf-8';

    if (str_contains(strtolower($contentType), 'json') && $body !== '') {
        try {
            $json = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
            $json = cms_rewrite_json_urls($json, $config);

            $repoRoot = 'repos/' . $config['repository'];
            if ($method === 'GET' && strcasecmp(ltrim($decodedPath, '/'), $repoRoot) === 0 && is_array($json)) {
                $permissions = is_array($json['permissions'] ?? null) ? $json['permissions'] : [];
                $permissions['pull'] = true;
                $permissions['push'] = true;
                $json['permissions'] = $permissions;
            }

            $body = json_encode($json, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } catch (JsonException) {
            // Preserve GitHub's original body if it is not JSON despite its media type.
        }
    }

    http_response_code($response['status']);
    header('Content-Type: ' . $contentType);

    foreach (['etag', 'last-modified', 'x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-ratelimit-resource'] as $name) {
        if (isset($response['headers'][$name][0])) {
            header($name . ': ' . $response['headers'][$name][0]);
        }
    }
    foreach (['link', 'location'] as $name) {
        if (isset($response['headers'][$name][0])) {
            header($name . ': ' . cms_rewrite_github_url($response['headers'][$name][0], $config));
        }
    }

    if ($method !== 'HEAD' && $response['status'] !== 204 && $response['status'] !== 304) {
        echo $body;
    }
    exit;
}

function cms_api_main(): never
{
    try {
        $config = cms_load_config();
        cms_send_api_headers($config);

        $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        if ($method === 'OPTIONS') {
            if (!cms_request_origin_is_allowed($config)) {
                cms_json_response(403, ['message' => 'Origin not allowed']);
            }
            http_response_code(204);
            exit;
        }

        if (!cms_request_origin_is_allowed($config)) {
            cms_json_response(403, ['message' => 'Origin not allowed']);
        }

        $token = cms_authorization_token();
        if ($token === null || cms_verify_session_token($token, $config) === null) {
            header('WWW-Authenticate: Bearer realm="Website-Verwaltung"');
            cms_json_response(401, ['message' => 'Ihre Anmeldung ist abgelaufen. Bitte melden Sie sich erneut an.']);
        }

        $path = cms_requested_api_path();
        if ($path['decoded'] === 'user' && $method === 'GET') {
            cms_json_response(200, [
                'login' => $config['username'],
                'name' => $config['display_name'],
                'email' => null,
                'avatar_url' => $config['site_origin'] . '/icons/logo.png',
                'type' => 'User',
            ]);
        }

        if (!cms_api_path_is_allowed($path['decoded'], $method, $config)) {
            cms_json_response(403, ['message' => 'Dieser Repository-Zugriff ist für die Website-Verwaltung nicht freigegeben.']);
        }

        $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength > (int) $config['max_request_bytes']) {
            cms_json_response(413, ['message' => 'Die Anfrage ist zu groß. Bitte verwenden Sie ein kleineres Bild.']);
        }

        $body = '';
        if (!in_array($method, ['GET', 'HEAD'], true)) {
            $rawBody = file_get_contents('php://input');
            if ($rawBody === false) {
                cms_json_response(400, ['message' => 'Die Anfrage konnte nicht gelesen werden.']);
            }
            if (strlen($rawBody) > (int) $config['max_request_bytes']) {
                cms_json_response(413, ['message' => 'Die Anfrage ist zu groß. Bitte verwenden Sie ein kleineres Bild.']);
            }
            $body = $rawBody;
        }

        $response = cms_proxy_github_request($config, $method, $path['raw'], $body);
        cms_emit_github_response($config, $response, $path['decoded'], $method);
    } catch (Throwable $error) {
        error_log('CMS API gateway error: ' . $error->getMessage());
        if (!headers_sent()) {
            http_response_code(502);
            header('Content-Type: application/json; charset=utf-8');
            header('Cache-Control: no-store');
        }
        echo json_encode([
            'message' => 'Die Verbindung zum Inhalts-Repository ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

if (realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    cms_api_main();
}
