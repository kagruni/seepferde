<?php

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

/** @param array<string, mixed> $config */
function cms_start_login_session(array $config): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('see_pferde_cms_login');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/cms-auth/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();

    if (!isset($_SESSION['cms_csrf']) || !is_string($_SESSION['cms_csrf'])) {
        $_SESSION['cms_csrf'] = cms_base64url_encode(random_bytes(32));
    }
}

function cms_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** @param array<string, mixed> $config */
function cms_render_auth_page(array $config, ?string $error = null, ?string $token = null, string $username = ''): never
{
    $nonce = cms_base64url_encode(random_bytes(18));
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('Pragma: no-cache');
    header('Referrer-Policy: no-referrer');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    header(
        "Content-Security-Policy: default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; "
        . "script-src 'nonce-{$nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'self'",
    );

    $originJson = json_encode($config['site_origin'], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR);
    $successPayload = $token === null ? 'null' : json_encode([
        'token' => $token,
        'provider' => 'github',
    ], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR);

    $csrf = cms_escape((string) ($_SESSION['cms_csrf'] ?? ''));
    $usernameValue = cms_escape($username);
    $errorMarkup = $error === null
        ? ''
        : '<div class="alert" id="login-error" role="alert"><strong>Anmeldung nicht möglich</strong><span>' . cms_escape($error) . '</span></div>';

    $formMarkup = $token !== null
        ? '<div class="success" role="status" aria-live="polite">'
            . '<span class="success__mark" aria-hidden="true">✓</span>'
            . '<h1 id="login-title">Anmeldung erfolgreich</h1>'
            . '<p>Die Anmeldung wird abgeschlossen und die Website-Verwaltung geöffnet.</p>'
            . '<button class="secondary-button" id="finish-login" type="button">Zur Website-Verwaltung</button>'
            . '</div>'
        : <<<HTML
            <div class="card__heading">
              <p class="eyebrow">Website-Verwaltung</p>
              <h1 id="login-title">Willkommen zurück</h1>
              <p class="intro">Melden Sie sich mit Ihren persönlichen Zugangsdaten an.</p>
            </div>
            {$errorMarkup}
            <form action="/cms-auth/form" method="post" id="login-form">
              <input type="hidden" name="csrf" value="{$csrf}">
              <input type="hidden" name="provider" value="github">
              <input type="hidden" name="site_id" value="{$config['site_id']}">
              <div class="field">
                <label for="username">Benutzername</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value="{$usernameValue}"
                  autocomplete="username"
                  autocapitalize="none"
                  spellcheck="false"
                  required
                  aria-describedby="username-hint"
                >
                <p class="field__hint" id="username-hint">Der von Ihrer Website-Betreuung eingerichtete Benutzername.</p>
              </div>
              <div class="field">
                <label for="password">Passwort</label>
                <div class="password-field">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    aria-describedby="password-hint"
                  >
                  <button type="button" id="toggle-password" aria-controls="password" aria-pressed="false">Anzeigen</button>
                </div>
                <p class="field__hint" id="password-hint">Ihr Passwort wird verschlüsselt übertragen und nicht im Website-Repository gespeichert.</p>
              </div>
              <button class="primary-button" type="submit" id="submit-button">
                <span id="submit-label">Sicher anmelden</span>
              </button>
              <p class="support-note">Passwort vergessen? Bitte wenden Sie sich an Ihre Website-Betreuung.</p>
            </form>
          HTML;

    echo <<<HTML
        <!doctype html>
        <html lang="de">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="robots" content="noindex,nofollow,noarchive">
            <meta name="theme-color" content="#4a6741">
            <link rel="icon" href="/icons/logo.svg" type="image/svg+xml">
            <title>Anmelden | Website-Verwaltung</title>
            <style>
              :root {
                color-scheme: light;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: #3d2e1f;
                background: #f0ebe1;
              }

              * { box-sizing: border-box; }

              body {
                min-width: 320px;
                min-height: 100vh;
                margin: 0;
                background:
                  radial-gradient(circle at 12% 8%, rgb(212 168 67 / 13%), transparent 34%),
                  linear-gradient(145deg, #faf7f2 0%, #f0ebe1 100%);
              }

              main {
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 28px 20px;
              }

              .shell { width: min(100%, 460px); }

              .brand {
                display: flex;
                justify-content: center;
                margin-bottom: 18px;
              }

              .brand img {
                width: 82px;
                height: 82px;
                object-fit: contain;
                filter: drop-shadow(0 10px 18px rgb(61 46 31 / 12%));
              }

              .card {
                padding: clamp(26px, 6vw, 40px);
                border: 1px solid #d9d0c2;
                border-radius: 22px;
                background: rgb(255 253 249 / 96%);
                box-shadow: 0 24px 70px rgb(61 46 31 / 13%);
              }

              .eyebrow {
                margin: 0 0 8px;
                color: #4a6741;
                font-size: .75rem;
                font-weight: 800;
                letter-spacing: .13em;
                text-transform: uppercase;
              }

              h1 {
                margin: 0;
                font-family: Georgia, "Times New Roman", serif;
                font-size: clamp(1.8rem, 6vw, 2.45rem);
                line-height: 1.12;
                letter-spacing: -.02em;
              }

              .intro {
                margin: 12px 0 0;
                color: #6b5e50;
                line-height: 1.55;
              }

              form { margin-top: 28px; }

              .field + .field { margin-top: 20px; }

              label {
                display: inline-block;
                margin-bottom: 8px;
                font-size: .93rem;
                font-weight: 750;
              }

              input {
                width: 100%;
                height: 50px;
                padding: 0 14px;
                border: 1px solid #b9ad9c;
                border-radius: 11px;
                outline: 0;
                background: #fff;
                color: #3d2e1f;
                font: inherit;
                transition: border-color .16s ease, box-shadow .16s ease;
              }

              input:hover { border-color: #8b6f47; }

              input:focus-visible {
                border-color: #4a6741;
                box-shadow: 0 0 0 4px rgb(74 103 65 / 16%);
              }

              .field__hint {
                margin: 7px 2px 0;
                color: #6b5e50;
                font-size: .78rem;
                line-height: 1.45;
              }

              .password-field { position: relative; }
              .password-field input { padding-right: 86px; }

              .password-field button {
                position: absolute;
                top: 50%;
                right: 6px;
                min-height: 38px;
                padding: 0 10px;
                border: 0;
                border-radius: 8px;
                background: transparent;
                color: #4a6741;
                font: inherit;
                font-size: .79rem;
                font-weight: 800;
                transform: translateY(-50%);
                cursor: pointer;
              }

              .password-field button:hover { background: #f0ebe1; }

              .password-field button:focus-visible,
              button:focus-visible {
                outline: 3px solid rgb(74 103 65 / 35%);
                outline-offset: 2px;
              }

              .primary-button,
              .secondary-button {
                width: 100%;
                min-height: 52px;
                border: 0;
                border-radius: 12px;
                font: inherit;
                font-weight: 800;
                cursor: pointer;
              }

              .primary-button {
                margin-top: 26px;
                background: #4a6741;
                color: #fff;
                box-shadow: 0 10px 24px rgb(74 103 65 / 22%);
                transition: background .16s ease, transform .16s ease, box-shadow .16s ease;
              }

              .primary-button:hover {
                background: #3d5736;
                box-shadow: 0 13px 28px rgb(74 103 65 / 28%);
                transform: translateY(-1px);
              }

              .primary-button:disabled {
                background: #788d72;
                box-shadow: none;
                transform: none;
                cursor: wait;
              }

              .support-note {
                margin: 18px 0 0;
                color: #6b5e50;
                font-size: .79rem;
                line-height: 1.5;
                text-align: center;
              }

              .alert {
                display: grid;
                gap: 3px;
                margin-top: 22px;
                padding: 13px 15px;
                border: 1px solid #d9a7a2;
                border-radius: 11px;
                background: #fff4f2;
                color: #7f2d27;
                font-size: .86rem;
                line-height: 1.45;
              }

              .success { text-align: center; }

              .success__mark {
                display: grid;
                place-items: center;
                width: 58px;
                height: 58px;
                margin: 0 auto 20px;
                border-radius: 50%;
                background: #e4edde;
                color: #3d5736;
                font-size: 1.7rem;
                font-weight: 900;
              }

              .success p {
                margin: 12px 0 24px;
                color: #6b5e50;
                line-height: 1.55;
              }

              .secondary-button {
                border: 1px solid #b9c8b4;
                background: #f3f7f1;
                color: #3d5736;
              }

              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                  scroll-behavior: auto !important;
                  transition-duration: .01ms !important;
                }
              }
            </style>
          </head>
          <body>
            <main>
              <div class="shell">
                <div class="brand"><img src="/icons/logo.svg" alt="See-Pferde Zwenkau"></div>
                <section class="card" aria-labelledby="login-title">
                  {$formMarkup}
                </section>
              </div>
            </main>
            <script nonce="{$nonce}">
              (function () {
                "use strict";
                var targetOrigin = {$originJson};
                var successPayload = {$successPayload};

                function authHost() {
                  if (window.opener) return window.opener;
                  if (window.parent && window.parent !== window) return window.parent;
                  return null;
                }

                function notifyReady() {
                  var host = authHost();
                  if (host) host.postMessage("authorizing:github", targetOrigin);
                }

                function completeLogin() {
                  var host = authHost();
                  if (!successPayload || !host) return;
                  host.postMessage(
                    "authorization:github:success:" + JSON.stringify(successPayload),
                    targetOrigin
                  );
                }

                window.addEventListener("message", function (event) {
                  if (event.origin === targetOrigin && event.data === "authorizing:github") {
                    completeLogin();
                  }
                });

                notifyReady();
                if (successPayload) {
                  window.setTimeout(completeLogin, 60);
                  var finishButton = document.getElementById("finish-login");
                  if (finishButton) finishButton.addEventListener("click", completeLogin);
                  return;
                }

                var password = document.getElementById("password");
                var toggle = document.getElementById("toggle-password");
                if (password && toggle) {
                  toggle.addEventListener("click", function () {
                    var shouldShow = password.type === "password";
                    password.type = shouldShow ? "text" : "password";
                    toggle.textContent = shouldShow ? "Ausblenden" : "Anzeigen";
                    toggle.setAttribute("aria-pressed", shouldShow ? "true" : "false");
                    password.focus();
                  });
                }

                var form = document.getElementById("login-form");
                var submitButton = document.getElementById("submit-button");
                var submitLabel = document.getElementById("submit-label");
                if (form && submitButton && submitLabel) {
                  form.addEventListener("submit", function () {
                    submitButton.disabled = true;
                    submitButton.setAttribute("aria-busy", "true");
                    submitLabel.textContent = "Anmeldung läuft …";
                  });
                }
              })();
            </script>
          </body>
        </html>
        HTML;
    exit;
}

function cms_auth_main(): never
{
    try {
        $config = cms_load_config();
        cms_start_login_session($config);

        $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        if (!in_array($method, ['GET', 'POST'], true)) {
            http_response_code(405);
            header('Allow: GET, POST');
            cms_render_auth_page($config, 'Diese Anfrage wird nicht unterstützt.');
        }

        $source = $method === 'POST' ? $_POST : $_GET;
        $provider = (string) ($source['provider'] ?? $_GET['provider'] ?? 'github');
        $siteId = (string) ($source['site_id'] ?? $_GET['site_id'] ?? '');
        if ($provider !== 'github' || !hash_equals($config['site_id'], $siteId)) {
            http_response_code(400);
            cms_render_auth_page($config, 'Der Anmeldelink ist ungültig. Bitte öffnen Sie die Website-Verwaltung erneut.');
        }

        if ($method === 'GET') {
            cms_render_auth_page($config);
        }

        $csrf = (string) ($_POST['csrf'] ?? '');
        $sessionCsrf = (string) ($_SESSION['cms_csrf'] ?? '');
        if ($csrf === '' || $sessionCsrf === '' || !hash_equals($sessionCsrf, $csrf)) {
            http_response_code(400);
            cms_render_auth_page($config, 'Die Anmeldung ist abgelaufen. Bitte öffnen Sie die Website-Verwaltung erneut.');
        }

        $username = trim((string) ($_POST['username'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');
        $rateLimitIdentity = $config['username'];
        if (cms_rate_limit_is_blocked($config, $rateLimitIdentity)) {
            usleep(random_int(250000, 450000));
            http_response_code(429);
            cms_render_auth_page($config, 'Zu viele Anmeldeversuche. Bitte warten Sie einige Minuten und versuchen Sie es erneut.', null, $username);
        }

        $usernameMatches = hash_equals($config['username'], $username);
        $passwordMatches = password_verify($password, $config['password_hash']);
        if (!$usernameMatches || !$passwordMatches) {
            cms_rate_limit_record_failure($config, $rateLimitIdentity);
            usleep(random_int(250000, 450000));
            http_response_code(401);
            cms_render_auth_page($config, 'Benutzername oder Passwort ist nicht korrekt.', null, $username);
        }

        cms_rate_limit_clear($config, $rateLimitIdentity);
        session_regenerate_id(true);
        $_SESSION = [];
        cms_render_auth_page($config, null, cms_issue_session_token($config));
    } catch (Throwable $error) {
        error_log('CMS authentication error: ' . $error->getMessage());
        http_response_code(503);
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow, noarchive');
        echo '<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            . '<title>Website-Verwaltung nicht eingerichtet</title><body style="font-family:system-ui;padding:2rem;background:#faf7f2;color:#3d2e1f">'
            . '<main style="max-width:38rem;margin:10vh auto;padding:2rem;border:1px solid #d9d0c2;border-radius:1rem;background:#fffdf9">'
            . '<h1 style="font-family:Georgia,serif">Anmeldung derzeit nicht verfügbar</h1>'
            . '<p>Die geschützte Website-Verwaltung ist noch nicht vollständig eingerichtet. Bitte wenden Sie sich an Ihre Website-Betreuung.</p>'
            . '</main></body></html>';
        exit;
    }
}

if (realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    cms_auth_main();
}
