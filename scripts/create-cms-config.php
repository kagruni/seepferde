<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Dieses Werkzeug darf nur in der Kommandozeile ausgeführt werden.\n");
    exit(1);
}

function option_value(array $options, string $name): string
{
    $value = trim((string) ($options[$name] ?? ''));
    if ($value === '') {
        fwrite(STDERR, sprintf("Die Option --%s fehlt.\n", $name));
        exit(1);
    }
    return $value;
}

function hidden_password(string $prompt): string
{
    fwrite(STDOUT, $prompt);
    $isInteractive = function_exists('shell_exec') && stream_isatty(STDIN);
    $terminalState = $isInteractive ? trim((string) shell_exec('stty -g 2>/dev/null')) : '';

    if ($terminalState !== '') {
        shell_exec('stty -echo 2>/dev/null');
    }

    try {
        $value = fgets(STDIN);
    } finally {
        if ($terminalState !== '') {
            shell_exec('stty ' . escapeshellarg($terminalState) . ' 2>/dev/null');
            fwrite(STDOUT, PHP_EOL);
        }
    }

    if ($value === false) {
        fwrite(STDERR, "Das Passwort konnte nicht gelesen werden.\n");
        exit(1);
    }
    return rtrim($value, "\r\n");
}

function base64url(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function usage(): never
{
    echo <<<'TEXT'
Erstellt die private Konfiguration für die CMS-Anmeldung.

Verwendung:
  php scripts/create-cms-config.php \
    --output=/home/USER/.config/seepferde-cms/config.php \
    --username=mandy \
    --display-name="Mandy Kolatka" \
    --repository=kagruni/seepferde \
    --site-origin=https://mandykolatka.kajik.dev \
    --app-id=123456 \
    --installation-id=12345678 \
    --private-key=/home/USER/.config/seepferde-cms/github-app.pem

Optional: --branch=main --force
Das Passwort wird verdeckt abgefragt und nie als Klartext gespeichert.

TEXT;
    exit(0);
}

$options = getopt('', [
    'help',
    'force',
    'output:',
    'username:',
    'display-name:',
    'repository:',
    'site-origin:',
    'branch::',
    'app-id:',
    'installation-id:',
    'private-key:',
]);

if (isset($options['help'])) {
    usage();
}

$output = option_value($options, 'output');
$username = option_value($options, 'username');
$displayName = option_value($options, 'display-name');
$repository = option_value($options, 'repository');
$siteOrigin = rtrim(option_value($options, 'site-origin'), '/');
$branch = trim((string) ($options['branch'] ?? 'main')) ?: 'main';
$appId = option_value($options, 'app-id');
$installationId = option_value($options, 'installation-id');
$privateKey = option_value($options, 'private-key');

$origin = parse_url($siteOrigin);
if (!is_array($origin) || ($origin['scheme'] ?? '') !== 'https' || empty($origin['host']) || isset($origin['path'])) {
    fwrite(STDERR, "--site-origin muss eine reine HTTPS-Origin ohne Pfad sein.\n");
    exit(1);
}
if (!preg_match('/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/', $repository)) {
    fwrite(STDERR, "--repository muss im Format owner/repository angegeben werden.\n");
    exit(1);
}
if (!is_file($privateKey) || !is_readable($privateKey)) {
    fwrite(STDERR, "Der private GitHub-App-Schlüssel wurde nicht gefunden oder ist nicht lesbar.\n");
    exit(1);
}
if (is_file($output) && !isset($options['force'])) {
    fwrite(STDERR, "Die Zieldatei existiert bereits. Verwenden Sie --force nur für eine bewusste Ersetzung.\n");
    exit(1);
}

$password = hidden_password('Neues CMS-Passwort (mindestens 12 Zeichen): ');
$confirmation = hidden_password('Passwort wiederholen: ');
if (strlen($password) < 12) {
    fwrite(STDERR, "Das Passwort muss mindestens 12 Zeichen lang sein.\n");
    exit(1);
}
if (!hash_equals($password, $confirmation)) {
    fwrite(STDERR, "Die Passwörter stimmen nicht überein.\n");
    exit(1);
}

$algorithm = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT;
$passwordHash = password_hash($password, $algorithm);
if (!is_string($passwordHash)) {
    fwrite(STDERR, "Der Passwort-Hash konnte nicht erstellt werden.\n");
    exit(1);
}
unset($password, $confirmation);

$siteId = (string) $origin['host'];
$values = [
    'site_origin' => $siteOrigin,
    'site_id' => $siteId,
    'repository' => $repository,
    'branch' => $branch,
    'username' => $username,
    'display_name' => $displayName,
    'password_hash' => $passwordHash,
    'session_secret' => base64url(random_bytes(48)),
    'session_ttl_seconds' => 28800,
    'github_app_id' => $appId,
    'github_installation_id' => $installationId,
    'github_private_key_file' => $privateKey,
    'rate_limit_attempts' => 5,
    'rate_limit_window_seconds' => 900,
    'rate_limit_lockout_seconds' => 900,
    'max_request_bytes' => 8388608,
];

$config = "<?php\n\ndeclare(strict_types=1);\n\nreturn " . var_export($values, true) . ";\n";
$directory = dirname($output);
if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
    fwrite(STDERR, "Das Zielverzeichnis konnte nicht erstellt werden.\n");
    exit(1);
}

if (file_put_contents($output, $config, LOCK_EX) === false) {
    fwrite(STDERR, "Die Konfiguration konnte nicht geschrieben werden.\n");
    exit(1);
}
chmod($output, 0600);

echo "Private CMS-Konfiguration erstellt: {$output}\n";
echo "Dateirechte: 0600. Die Datei darf nicht in public_html liegen.\n";

