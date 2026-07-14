# See-Pferde Zwenkau

Statische Website für See-Pferde Zwenkau mit Next.js 16, TypeScript,
Tailwind CSS und einem Git-basierten Decap CMS.

## Entwicklung

```bash
npm ci
npm run dev
```

Die Website läuft anschließend unter `http://localhost:3000` beziehungsweise
dem nächsten freien Port. Gleichzeitig startet der lokale CMS-Inhaltsdienst auf
Port `8082`, sodass `/admin` lokal ohne Produktionsanmeldung geöffnet werden
kann. Die lokale Proxy-Anmeldung wird automatisch bestätigt; die
Inhaltsübersicht erscheint direkt.

## CMS lokal testen

`http://localhost:3000/admin` öffnen. Inhalte liegen unter `content/`,
Uploads unter `public/images/uploads/`. Die lokale Entwicklungsumgebung leitet
automatisch auf die statische CMS-Datei weiter. `npm run cms:proxy` bleibt als
separater Diagnosebefehl verfügbar; `npm run dev:web` startet nur Next.js.

## Qualitätsprüfungen

```bash
npm run cms:bundle:check
npm run content:validate
npm run typecheck
npm run lint
npm run build
```

Der statische Export wird in `out/` erzeugt. Dynamische Angebote und
Veranstaltungen werden zur Build-Zeit als statische Routen generiert.

## Dokumentation

- `CMS_IMPLEMENTATION_SPEC.md`: Architektur, Inhaltsmodell, UX- und
  Abnahmespezifikation
- `CMS_SETUP.md`: Eigentümer-Login, GitHub-App-Einrichtung, Redaktionsablauf, Deployment und
  Fehlerbehebung

Vor dem produktiven CMS-Start müssen die private cPanel-Konfiguration für den
Eigentümer-Login, die Repository-spezifische GitHub App sowie die öffentliche
Telefonnummer und E-Mail-Adresse hinterlegt werden.
