# Website-Verwaltung – Einrichtung und Redaktionshandbuch

Die öffentliche Website bleibt ein vollständig statischer Next.js-Export. Die
Website-Verwaltung läuft im Browser unter `/admin/` und speichert Änderungen als
Dateien und Pull Requests im GitHub-Repository. Nur die geschützte Anmeldung und
der auf ein Repository beschränkte GitHub-API-Zugang laufen serverseitig über
PHP unter `/cms-auth/`.

Die Inhaberin benötigt kein GitHub-Konto und erhält keinen Repository-Zugriff.
Sie meldet sich mit einem von der Website-Betreuung eingerichteten Benutzernamen
und Passwort an. Das Passwort wird ausschließlich als sicherer Hash außerhalb
des Webverzeichnisses gespeichert.

## Vor dem ersten produktiven Login

### 1. Servervoraussetzungen prüfen

Der cPanel-Webspace benötigt:

- Apache mit `.htaccess`, `mod_rewrite` und `mod_headers`;
- PHP 8.2 oder neuer;
- PHP-Erweiterungen `curl`, `openssl` und `session`;
- eine funktionierende HTTPS-Konfiguration für `mandykolatka.kajik.dev`.

Über das cPanel-Terminal prüfen:

```bash
php -v
php -m | grep -E 'curl|openssl|session'
```

### 2. Repository-spezifische GitHub App anlegen

Im eigenen GitHub-Konto unter **Settings → Developer settings → GitHub Apps**
eine App anlegen, zum Beispiel `See-Pferde Website CMS`.

Konfiguration:

- Homepage URL: `https://mandykolatka.kajik.dev`
- Webhooks: deaktiviert
- Callback URL / Benutzerautorisierung: nicht erforderlich
- Installierbar: nur im eigenen Konto

Repository-Berechtigungen:

- **Contents:** Read and write
- **Pull requests:** Read and write
- **Issues:** Read and write
- **Commit statuses:** Read-only
- **Metadata:** Read-only (automatisch)

Die App anschließend mit **Only select repositories** ausschließlich auf
`kagruni/seepferde` installieren. App-ID und Installations-ID notieren. Die
Installations-ID ist unter anderem die Zahl in der URL der installierten App.
Danach einen privaten App-Schlüssel erzeugen und die heruntergeladene PEM-Datei
nicht in das Repository legen.

### 3. Private Dateien auf cPanel ablegen

Die folgenden Dateien liegen außerhalb von `public_html` beziehungsweise
außerhalb des in `CPANEL_REMOTE_PATH` konfigurierten Webverzeichnisses:

```bash
mkdir -p ~/.config/seepferde-cms
chmod 700 ~/.config/seepferde-cms
mv ~/github-app-private-key.pem ~/.config/seepferde-cms/github-app.pem
chmod 600 ~/.config/seepferde-cms/github-app.pem
```

`scripts/create-cms-config.php` einmalig per SFTP in dieses private Verzeichnis
kopieren und dort ausführen:

```bash
php ~/.config/seepferde-cms/create-cms-config.php \
  --output="$HOME/.config/seepferde-cms/config.php" \
  --username=mandy \
  --display-name="Mandy Kolatka" \
  --repository=kagruni/seepferde \
  --site-origin=https://mandykolatka.kajik.dev \
  --app-id=GITHUB_APP_ID \
  --installation-id=GITHUB_INSTALLATION_ID \
  --private-key="$HOME/.config/seepferde-cms/github-app.pem"
```

Das Werkzeug fragt das Passwort verdeckt ab, speichert nur einen
`password_hash()`-Wert, erzeugt ein zufälliges Sitzungssignal und setzt die
Dateirechte auf `0600`. Das kopierte Werkzeug danach wieder löschen; die
erzeugte `config.php` und die PEM-Datei bleiben bestehen.

Der Gateway sucht standardmäßig unter
`~/.config/seepferde-cms/config.php`. Falls PHP auf dem Webserver kein
Benutzerverzeichnis erkennen kann, muss die Servervariable `CMS_AUTH_CONFIG`
auf den absoluten privaten Pfad gesetzt werden. Der Gateway verweigert bewusst
jede Konfigurations- oder Schlüsseldatei innerhalb des Webverzeichnisses.

### 4. Branch-Schutz festlegen

`main` bleibt geschützt. Die Prüfungen für Inhalt, Typen, Lint und Build müssen
vor dem Merge erfolgreich sein. Zusätzlich festlegen, ob die GitHub App nach
grünen Prüfungen selbst mergen darf oder ob die Website-Betreuung den letzten
Merge in GitHub ausführt.

### 5. Anmeldung abnehmen

1. `https://mandykolatka.kajik.dev/cms-auth/form?provider=github&site_id=mandykolatka.kajik.dev`
   öffnen und die gebrandete Anmeldemaske prüfen.
2. Einen falschen Login testen: Die Meldung darf nicht verraten, ob Benutzername
   oder Passwort falsch war.
3. `https://mandykolatka.kajik.dev/admin/` öffnen und mit dem eingerichteten
   Benutzer anmelden. Die Anmeldemaske erscheint innerhalb der
   Website-Verwaltung; es wird kein separates Browserfenster geöffnet.
4. Einen sicheren Testentwurf anlegen, zur Prüfung geben, Checks abwarten und
   veröffentlichen beziehungsweise administrativ mergen.
5. Prüfen, dass der Build nach `main` startet und die Änderung live erscheint.

Im Browser oder in der öffentlichen Konfiguration dürfen weder Passwort-Hash,
Sitzungssignal, GitHub-App-Schlüssel noch GitHub-Installationstoken erscheinen.

## Fehlende Live-Daten vor dem Launch

In `content/settings/site.json` müssen noch die echte öffentliche Telefonnummer
und E-Mail-Adresse eingetragen werden. Solange keine E-Mail-Adresse vorhanden
ist, zeigt das Anfrageformular bewusst einen Einrichtungs-Hinweis und erzeugt
keinen leeren `mailto:`-Link.

Die Rechtstexte wurden technisch in das CMS migriert, sind dadurch aber nicht
automatisch rechtlich geprüft. Änderungen an Impressum und Datenschutz müssen
fachlich geprüft und im CMS mit Prüfer und Prüfdatum dokumentiert werden.

## Lokale Entwicklung

Abhängigkeiten einmalig installieren:

```bash
npm ci
```

Danach reicht ein Terminal:

```bash
npm run dev
```

Öffnen Sie anschließend `http://localhost:3000/admin`. Eine ausschließlich in
der Entwicklungsumgebung aktive Next.js-Weiterleitung öffnet die statische
Datei `/admin/index.html`. `npm run dev` startet gleichzeitig die Website und
den lokalen Inhaltsdienst auf Port `8082`; deshalb ist lokal keine Anmeldung
erforderlich. Die lokale Proxy-Anmeldung wird beim Öffnen automatisch bestätigt.
Der lokale Inhaltsdienst dient zum Prüfen der Formulare, Dateiformate und
Workflow-Ansichten. Er arbeitet mit lokalen Git-Branches und bildet die
produktive GitHub-App- und Pull-Request-Strecke nicht ab. Falls nur die Website
benötigt wird, kann stattdessen `npm run dev:web` verwendet werden.

## Inhalte bearbeiten

Die Navigation ist nach typischen Aufgaben sortiert:

1. Seiten
2. Angebote
3. Veranstaltungen
4. Team
5. Pferde
6. Galerie
7. Hinweise & Banner
8. Rechtliches
9. Website-Einstellungen

Die öffentliche Hauptnavigation ist absichtlich nicht editierbar. Dadurch kann
eine Inhaltsänderung keine Route entfernen oder einen ungültigen Menüpunkt
erzeugen.

### Sicherer Redaktionsablauf

1. Gewünschten Eintrag öffnen oder neu anlegen.
2. Inhalt, Bild und Bildbeschreibung ausfüllen.
3. Vorschau kontrollieren; bei Rechtstexten zusätzlich fachlich prüfen lassen.
4. Als Entwurf speichern.
5. Im Editorial Workflow auf „Zur Prüfung“ setzen.
6. Automatische Inhalts-, Typ-, Lint- und Build-Prüfungen abwarten.
7. Pull Request prüfen und erst dann veröffentlichen beziehungsweise mergen.

„Entwurf speichern“ ändert die Live-Website nicht. Erst der Merge nach `main`
startet den Produktions-Build.

### Bilder

- Bilder nur über die vorgesehenen Bildfelder hochladen.
- Aussagekräftige Dateinamen und immer einen echten Alt-Text verwenden.
- Empfohlen: WebP oder optimiertes JPEG, maximal 2,5 MB pro Datei.
- Keine Bilder per externer URL einbinden.
- Für Galerieeinträge werden Breite und Höhe automatisch aus der Datei gelesen.

### Veranstaltungen und Hinweise

- Bei Veranstaltungen nur `Geplant`, `Ausgebucht` oder `Abgesagt` pflegen.
  „Bevorstehend“ und „Vergangen“ werden aus dem Datum in der Zeitzone
  `Europe/Berlin` berechnet.
- Ausgebuchte und abgesagte Veranstaltungen zeigen keinen aktiven
  Anmeldebutton.
- Zeitgesteuerte Hinweise werden einschließlich Start- und Enddatum angezeigt.
- Ein täglicher Build aktualisiert datumsabhängige Inhalte auch dann, wenn an
  diesem Tag kein Redakteur veröffentlicht.

### Preise

Preise werden direkt am jeweiligen Angebot gepflegt. Die Preisseite liest diese
Angaben automatisch aus; es gibt keine zweite, unabhängig zu pflegende
Preisliste.

## Qualitätsprüfungen

Vor einem manuellen Merge oder nach Änderungen an der CMS-Konfiguration:

```bash
npm run cms:auth:test
npm run cms:bundle:check
npm run content:validate
npm run typecheck
npm run lint
npm run build
```

`content:validate` prüft unter anderem Pflichtfelder, Relationen, Slugs,
Datumslogik, Bildpfade, Bilddateien, Preisregeln und Platzhalter. Fehler nennen
die betroffene Datei und das Feld.

### Eigene Dialoge im CMS

Die Website-Verwaltung verwendet keine nativen `alert`-, `confirm`- oder
`prompt`-Fenster des Browsers und öffnet für die Anmeldung kein separates
Browserfenster. Bestätigungen, Anmeldung und Link-Eingaben erscheinen als
barrierearme, gebrandete Overlays mit Fokusfalle, Escape-Abbruch und
Fokusrückgabe. Hinweise erscheinen als schließbare Meldungen. Der native
Browser-Hinweis beim Schließen eines Tabs ist deaktiviert; die lokale
Entwurfssicherung bleibt davon unberührt.

Das ausgelieferte `public/admin/decap-cms.js` wird reproduzierbar aus der exakt
gepinnten Version 3.14.1 erzeugt. Das Generierungswerkzeug prüft vor der
Transformation die SHA-256-Prüfsumme und bricht ab, sobald sich Anzahl oder Form
der zu ersetzenden Aufrufe ändern. Nur bei einem bewussten CMS-Update neu
erzeugen:

```bash
npm run cms:bundle
npm run cms:bundle:check
```

Die generierte Datei nicht von Hand bearbeiten.

## Deployment nach cPanel

`.github/workflows/deploy.yml` reagiert auf:

- Pull Requests: Validierung, Typprüfung, Lint und statischer Build;
- Push auf `main`: gleiche Prüfungen und danach Deployment;
- manuellen Start;
- täglichen Zeitplan für datumsabhängige Inhalte.

Benötigte GitHub Actions Secrets:

- `CPANEL_HOST`
- `CPANEL_USERNAME`
- `CPANEL_REMOTE_PATH`
- `CPANEL_SSH_KEY`

Das Deployment synchronisiert erst nach erfolgreichem Build den Inhalt von
`out/` mit dem Zielverzeichnis. Produktions-Deployments laufen seriell, damit
zwei Veröffentlichungen sich nicht gegenseitig überschreiben.

Der Sync verwendet `--delete`, betrifft jedoch nur `CPANEL_REMOTE_PATH`. Die
private Konfiguration und der GitHub-App-Schlüssel müssen deshalb außerhalb
dieses Pfades liegen. Sie werden weder gebaut noch von GitHub Actions
übertragen oder gelöscht.

## Webserver-Regel für den Admin

Der einzige Admin-Einstieg ist `public/admin/index.html`. Nach dem Deployment
müssen beide Aufrufe funktionieren:

- `https://mandykolatka.kajik.dev/admin/`
- `https://mandykolatka.kajik.dev/admin` als Redirect auf `/admin/`

Die mit ausgelieferte `public/.htaccess` richtet diese Weiterleitung ein;
Apache muss dafür Repository-Regeln per `.htaccess` erlauben. Die Adminseite ist
mit `noindex,nofollow` gekennzeichnet; das ist kein Zugriffsschutz, sondern nur
eine Suchmaschinen-Anweisung. Eine eigene `public/admin/.htaccess` verhindert,
dass die nicht gehashten CMS-Konfigurations- und Vorschaudateien veraltet im
Browser-Cache bleiben.

`public/cms-auth/.htaccess` bildet zusätzlich die öffentlichen Routen `/form`
und `/repository/*` auf PHP ab, verhindert Verzeichnislisten und sperrt gemeinsame
Hilfsdateien vor direktem Webzugriff. Nach jedem Deployment prüfen, dass ein
Aufruf von `/cms-auth/_bootstrap.php` mit `403` beantwortet wird.

## Zugang verwalten

### Passwort zurücksetzen

Das Provisionierungswerkzeug mit denselben Parametern und zusätzlich `--force`
erneut ausführen. Dadurch werden sowohl der Passwort-Hash als auch das
Sitzungssignal ersetzt; vorhandene CMS-Sitzungen verlieren sofort ihre
Gültigkeit.

### Zugang sofort sperren

Die private `config.php` vorübergehend umbenennen oder für den PHP-Prozess
unlesbar machen. Die Anmeldeseite zeigt anschließend nur den neutralen Hinweis,
dass die Verwaltung nicht eingerichtet ist. Zum dauerhaften Entzug zusätzlich
die GitHub App aus dem Repository deinstallieren.

### GitHub-App-Schlüssel rotieren

In GitHub einen neuen privaten Schlüssel erzeugen, die neue PEM-Datei außerhalb
des Webverzeichnisses hinterlegen, den Pfad in `config.php` aktualisieren und
einen vollständigen Redaktionsablauf testen. Erst danach den alten Schlüssel in
GitHub löschen.

## Fehlerbehebung

- **Anmeldung zeigt „noch nicht vollständig eingerichtet“:** Existenz,
  Eigentümer und Modus `0600` von `~/.config/seepferde-cms/config.php` und
  `github-app.pem` prüfen; bei abweichendem Pfad `CMS_AUTH_CONFIG` prüfen.
- **Anmeldemaske endet mit 404:** `public/cms-auth/.htaccess`, `mod_rewrite` und
  die PHP-Zuordnung des cPanel-Hosts prüfen.
- **Anmeldemaske endet mit 406:** Nur `/cms-auth/form` und
  `/cms-auth/repository/*` verwenden. Die naheliegenden Pfadnamen `/auth`,
  `/login` und `/api` werden von den aktuellen cPanel-ModSecurity-Regeln
  blockiert.
- **Anmeldung korrekt, Repository-Zugriff schlägt fehl:** App-ID,
  Installations-ID, ausgewähltes Repository und die vier App-Berechtigungen
  prüfen. Danach den privaten Token-Cache unter
  `~/.config/seepferde-cms/cache/` löschen und erneut anmelden.
- **„Zu viele Anmeldeversuche“:** 15 Minuten warten oder als Administrator die
  passende Datei unter `~/.config/seepferde-cms/rate-limits/` entfernen.
- **CMS meldet nach längerer Pause ab:** Die CMS-Sitzung ist standardmäßig acht
  Stunden gültig. Neu anmelden; dies ist unabhängig vom einstündigen, intern
  automatisch erneuerten GitHub-Installationstoken.
- **Eintrag lässt sich nicht speichern:** Feldhinweise und Browserkonsole prüfen,
  dann `npm run content:validate` lokal ausführen.
- **Vorschau fehlt:** Eintrag zunächst speichern; bei neuen Relationen müssen die
  referenzierten Inhalte bereits existieren.
- **Build rot:** Im GitHub-Check die erste Meldung mit Dateipfad beheben. Nicht
  trotz fehlgeschlagener Prüfung veröffentlichen.
- **Änderung nicht live:** Prüfen, ob der Pull Request wirklich gemergt und der
  Workflow „Build and Deploy Static Site“ erfolgreich beendet wurde.
