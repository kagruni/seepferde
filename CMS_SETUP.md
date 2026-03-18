# Decap CMS Setup

## 1. GitHub backend

Tragen Sie in [public/admin/config.yml](/Users/kajik/Documents/cpanel/mandykolatka.kajik.dev/public/admin/config.yml) den echten GitHub-Repository-Namen und die URL des OAuth-Bridge-Dienstes ein:

- `backend.repo`
- `backend.base_url`

Decap benoetigt fuer GitHub-Login einen kleinen OAuth-Callback-Dienst. Die Website selbst bleibt trotzdem statisch.

## 2. cPanel Deployment

Der Workflow in [.github/workflows/deploy.yml](/Users/kajik/Documents/cpanel/mandykolatka.kajik.dev/.github/workflows/deploy.yml) erwartet diese Secrets:

- `CPANEL_HOST`
- `CPANEL_USERNAME`
- `CPANEL_REMOTE_PATH`
- `CPANEL_SSH_KEY`

## 3. Content workflow

- Redakteure bearbeiten Inhalte unter `/admin`.
- Decap erstellt fuer Entwuerfe Editorial-Workflow-Branches.
- Nach Veroeffentlichung landet der Content im Repo.
- GitHub Actions baut die statische Site und synchronisiert `out/` nach cPanel.
