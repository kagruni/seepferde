# Decap CMS Completion Specification

**Project:** See-Pferde Zwenkau / Reiterhof Mandy Kolatka<br>
**Repository:** `kagruni/seepferde`<br>
**Website:** `https://mandykolatka.kajik.dev`<br>
**CMS:** Git-based editor with a private username/password gateway and GitHub App backend<br>
**Application:** Next.js 16 App Router, static export<br>
**Specification status:** Ready for implementation<br>
**Last updated:** 13 July 2026

---

## 1. Purpose

This specification defines the work required to complete the Decap CMS integration for the See-Pferde Zwenkau website.

The completed system must allow a trusted, non-technical editor to maintain all normal website content without editing source code. It must preserve the current static Next.js architecture, publish through Git, and deploy the generated `out/` directory to cPanel.

The CMS must feel like an editorial application, not like a developer tool. German labels, clear explanations, safe defaults, meaningful previews, useful validation, and a predictable publish flow are mandatory.

This document is normative. Where the current implementation conflicts with this specification, this specification describes the target state.

---

## 2. Executive summary

The project already contains a viable partial Decap CMS implementation:

- `/public/admin/index.html` loads Decap CMS.
- `/public/admin/config.yml` defines initial collections.
- `/content` contains JSON settings and Markdown collections.
- `/src/lib/content/index.ts` reads and validates content at build time.
- Offers and events use static dynamic routes generated from content.
- GitHub Actions builds the static site and deploys `out/` to cPanel.

The implementation is incomplete because:

- GitHub authentication still contains placeholder configuration.
- Several pages remain hardcoded.
- The content model contains duplicated and unused fields.
- Editors must manage technical values such as slugs, raw URLs, and image dimensions.
- Event and announcement dates can become stale in a static build.
- There are no CMS-specific content previews.
- Pull requests are not validated before publication.
- Media handling is not safe enough for ongoing non-technical use.
- The admin route has two competing implementations.

The target solution keeps Decap and the file-based content model, but reorganizes the schema around editorial tasks and adds the missing operational safeguards.

---

## 3. Goals

### 3.1 Functional goals

The CMS must allow editors to:

1. Edit the homepage and all page introductions.
2. Create, edit, hide, reorder, and delete offers.
3. Manage each offer's pricing without a separate duplicated price record.
4. Create and manage events and their registration state.
5. Select the offers and event featured on the homepage.
6. Edit the About page and Mandy Kolatka's biography.
7. Create and maintain team profiles.
8. Create and maintain horse profiles.
9. Upload, categorize, caption, hide, and reorder gallery images.
10. Create temporary announcements with optional start and end dates.
11. Update contact information, availability, footer text, and map location.
12. Maintain page-level SEO titles, descriptions, and social images.
13. Maintain structured legal identity information.
14. Update the Impressum and Datenschutz text through a clearly separated legal section.
15. Preview important content before publication.
16. Save drafts, request review, and publish through the editorial workflow.

### 3.2 UX goals

The CMS must:

- Use German for all editor-facing labels, hints, validation messages, and collection names.
- Present collections in the order editors are most likely to use them.
- Keep technical and rarely changed settings out of the primary workflow.
- Use descriptive labels instead of internal names.
- Provide an explanation below any field whose purpose may be unclear.
- Use relation selectors instead of asking editors to type slugs or IDs.
- Use fixed choices instead of free-text URLs where the set of valid choices is known.
- Collapse optional and advanced groups by default.
- Show useful entry summaries in collection lists and collapsed list fields.
- Require alt text wherever an image is used editorially.
- Validate fields before saving whenever Decap supports it.
- Provide visible feedback while logging in, saving, opening previews, and publishing.
- Remain keyboard accessible and usable at 375 px, 768 px, 1024 px, and 1440 px viewport widths.

### 3.3 Operational goals

- A content publication must create or update Git content and trigger a validated static build.
- Invalid content must never reach the production deployment step.
- Production deployments must be serialized so two CMS publications cannot race.
- Date-driven content must update without requiring a human to create an unrelated commit.
- Password hashes, session secrets, GitHub App credentials, and deployment secrets must never be committed to the repository.
- Existing public URLs must remain stable during migration.

---

## 4. Non-goals

The following are explicitly outside the CMS:

- A free-form drag-and-drop page builder.
- Editing React components, routes, Tailwind classes, fonts, colors, animations, or layout rules.
- Arbitrary creation of new page types.
- Editing GitHub App, authentication-gateway, cPanel, or deployment secrets.
- Managing form submissions in a database.
- Managing customer accounts, bookings, payments, or inventory.
- Per-field or per-collection role permissions inside Decap.
- Real-time server-side content updates without a static rebuild.

The initial launch supports one owner account. Multiple accounts, granular roles, self-service password reset, and two-factor authentication require a separate account store and are outside this implementation phase.

---

## 5. Product and editor assumptions

### 5.1 Primary editor

The primary editor is a non-technical business owner or trusted employee who:

- understands the business content;
- may not understand Git, YAML, Markdown, slugs, frontmatter, or build pipelines;
- uses the CMS occasionally rather than every day;
- needs confidence that saving a draft does not immediately change the live website;
- needs to recognize content by its visible title and image.

### 5.2 Administrator

The administrator:

- manages GitHub repository access;
- manages the repository-scoped GitHub App and the private cPanel gateway configuration;
- creates, rotates, disables, and recovers the owner login;
- reviews failed builds and deployment logs;
- updates CMS schemas and application code;
- performs legal-text changes if CMS access is intentionally restricted to administrators.

### 5.3 Permission model

The owner does not receive a GitHub account, repository membership, or a permanent GitHub token. The CMS login authenticates the owner through the site's server-side gateway. The gateway then performs repository operations as a GitHub App installed only on `kagruni/seepferde`.

Therefore:

- CMS access is limited to the explicitly configured username/password account.
- The password is stored only as an Argon2id or `password_hash()` compatible hash outside the web root.
- The browser receives an opaque, repository-bound CMS session token, never the GitHub App private key or installation token.
- GitHub installation tokens are created server-side, limited to the selected repository and required permissions, cached outside the web root, and expire after one hour.
- The main branch remains protected and content/build checks remain required.
- This single-account model has no per-collection roles. Legal-content restrictions remain procedural unless the account layer is extended.

---

## 6. Architecture

### 6.1 Target flow

```text
Owner opens /admin/
        |
        v
Branded username/password login verifies the owner server-side
        |
        v
The gateway issues an opaque, repository-bound CMS session
        |
        v
The gateway exchanges its GitHub App identity for a short-lived installation token
        |
        v
The editor reads and writes repository content through the allowlisted API proxy
        |
        v
Editorial workflow creates a cms/* branch and pull request
        |
        v
Content validation, TypeScript and static build checks run
        |
        v
The approved content is merged into main
        |
        v
GitHub Actions builds the static Next.js export
        |
        v
out/ is synchronized to cPanel
```

### 6.2 Runtime model

- The public website remains fully static.
- Decap runs only in the browser under `/admin/`.
- Content is stored in the Git repository as JSON, Markdown frontmatter, Markdown bodies, and media files.
- Next.js reads content only during development and build.
- Public pages do not call Decap, GitHub, or an external content API at runtime.
- No API routes or server-side rendering are introduced.

### 6.3 Publishing model

- `publish_mode` must remain `editorial_workflow`.
- Drafts must not modify `main`.
- Publishing must merge an editorial branch into `main`.
- The production deployment must run only after validation and build succeed.
- `squash_merges: true` should be used to keep content history readable.

---

## 7. Repository content architecture

### 7.1 Target structure

```text
content/
├── settings/
│   ├── site.json
│   └── legal.json
├── pages/
│   ├── home.json
│   ├── about.json
│   ├── contact.json
│   ├── offers.json
│   ├── events.json
│   ├── horses.json
│   ├── prices.json
│   └── gallery.json
├── offers/
│   └── *.md
├── events/
│   └── *.md
├── team/
│   └── *.md
├── horses/
│   └── *.md
├── gallery/
│   └── *.md
├── announcements/
│   └── *.md
└── legal/
    ├── imprint.md
    └── privacy.md
```

### 7.2 Content format rules

- Unique pages and settings use JSON file collections.
- Repeatable content uses Markdown folder collections.
- Long-form copy uses a `body` field stored after frontmatter.
- Every file must be UTF-8.
- Dates must be stored as `YYYY-MM-DD`.
- Times, if used, must be stored as `HH:mm` local time for `Europe/Berlin`.
- Public image paths must begin with `/images/`.
- Entry filenames are the canonical route slugs for folder collections.
- Slugs are generated when an entry is first created and are not exposed as normal editable fields.
- Renaming an entry title must not silently change an existing public URL.

### 7.3 Removed or consolidated content

- `content/prices/*.md` must be merged into `content/offers/*.md` and removed after migration is verified.
- `content/settings/home.json` moves to `content/pages/home.json`.
- Editable navigation links are removed from site settings.
- Raw map embed URLs are replaced by a structured map location.
- Duplicate full-address and postal-address fields are replaced by one structured address object.
- `featured` booleans on offers and events are replaced by homepage relation fields.
- Frontmatter `slug` fields are removed after all loaders derive the slug from the filename.
- Gallery `width` and `height` fields are removed from the editor model and derived from the image file.

---

## 8. CMS information architecture

Collections must appear in this order in the Decap sidebar:

1. **Seiten**
2. **Angebote**
3. **Veranstaltungen**
4. **Team**
5. **Pferde**
6. **Galerie**
7. **Hinweise & Banner**
8. **Rechtliches**
9. **Website-Einstellungen**

This order is deliberate:

- Frequent editorial tasks appear first.
- Business content is separated from technical site settings.
- Legal content is clearly labeled and isolated.
- Settings are last because they have broad site-wide impact.

### 8.1 Collection naming rules

- Collection labels and singular labels must be in German.
- Labels must describe the visible website concept, not the storage format.
- Do not use labels such as `Settings`, `Frontmatter`, `Slug`, `Body`, or `SortOrder`.
- Recommended equivalents are `Website-Einstellungen`, `Seiteninhalt`, `Webadresse` only when necessary, `Inhalt`, and `Reihenfolge`.

### 8.2 Collection list summaries

Each folder collection must define a concise summary:

- Offers: `{{title}} · {{category}}`
- Events: `{{title}} · {{date}} · {{state}}`
- Team: `{{name}} · {{role}}`
- Horses: `{{name}} · {{breed}}`
- Gallery: `{{title}} · {{category}}`
- Announcements: `{{title}} · {{enabled}}`

Collection lists must support sorting and filtering by fields relevant to that collection. Examples include category, visibility, date, and state.

---

## 9. Global Decap configuration

### 9.1 Required configuration shape

The public editor configuration points to the same-origin authentication and GitHub API gateway. It contains no passwords, hashes, GitHub private keys, or installation tokens.

```yaml
backend:
  name: github
  repo: kagruni/seepferde
  branch: main
  base_url: https://mandykolatka.kajik.dev
  auth_endpoint: cms-auth/form
  api_root: https://mandykolatka.kajik.dev/cms-auth/repository
  site_domain: mandykolatka.kajik.dev
  use_graphql: false
  squash_merges: true

locale: de
publish_mode: editorial_workflow

site_url: https://mandykolatka.kajik.dev
display_url: https://mandykolatka.kajik.dev
show_preview_links: true

logo:
  src: /icons/logo.svg
  show_in_header: true

media_folder: public/images/uploads
public_folder: /images/uploads
```

Use Decap's default repository media library with an upload-size configuration:

```yaml
media_folder: public/images/uploads
public_folder: /images/uploads

media_library:
  config:
    max_file_size: 2500000
```

### 9.2 Slug configuration

Use predictable ASCII filenames for newly created folder entries:

```yaml
slug:
  encoding: ascii
  clean_accents: true
  sanitize_replacement: "-"
```

Existing filenames and public URLs must be preserved.

### 9.3 Admin entry point

- `/public/admin/index.html` is the only CMS entry point.
- Remove `/src/app/admin/page.tsx` after confirming the web server serves `/admin/index.html` for `/admin/`.
- Configure Apache/cPanel to redirect `/admin` to `/admin/` if required.
- Add `<meta name="robots" content="noindex,nofollow">` to the admin page.
- Pin Decap to an exact, tested version. Do not use a caret range in the CDN URL.
- The selected version must support the chosen widgets and must be tested for round-trip serialization before launch.
- If the `richtext` widget is used, the pinned Decap version must be 3.12.0 or newer. If richtext round-trip tests reveal data loss, retain the existing Markdown widget temporarily and record the reason.

### 9.3.1 Browser-dialog policy

- The owner-facing CMS must not invoke native browser `alert`, `confirm`, or `prompt` dialogs.
- The username/password authentication page must open inside a same-page branded overlay, not a browser popup window.
- Destructive actions and unsaved-change navigation must use a branded in-page alert dialog with a safe default focus on Cancel.
- URL and link entry must use a branded in-page dialog with a labelled input.
- Informational alerts must use dismissible, screen-reader-announced notices.
- Custom dialogs must trap focus, close with Escape, restore focus to the trigger, support keyboard-only operation, and respect reduced-motion preferences.
- Do not register `beforeunload`: browsers only permit a native, non-brandable prompt for that event. Rely on the editor's local draft backup and in-app navigation confirmation instead.
- Serve the verified patched CMS bundle locally rather than loading the unmodified CDN bundle at runtime.
- The transformation must pin the upstream version and source SHA-256, assert the expected replacement counts, and fail closed when upstream code changes.

### 9.4 Local development

Provide a documented local CMS workflow:

```text
npm run dev
Browser:    http://localhost:3000/admin/
```

Add scripts equivalent to:

```json
{
  "scripts": {
    "dev": "node scripts/dev-with-cms.mjs",
    "dev:web": "next dev",
    "cms:proxy": "PORT=8082 MODE=git decap-server",
    "cms:bundle": "node scripts/build-admin-cms.mjs",
    "cms:bundle:check": "node scripts/build-admin-cms.mjs --check",
    "content:validate": "tsx scripts/validate-content.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

The exact runner may vary, but it must be committed and reproducible. Git mode must be used so the local proxy exposes the editorial workflow with local branches. Local testing does not reproduce the production GitHub App or pull-request path.

---

## 10. Common field and UX standards

### 10.1 Field ordering

Every entry form must use this order where applicable:

1. Identity: title or name.
2. Visibility and editorial state.
3. Primary content.
4. Supporting details.
5. Image and alt text.
6. Relationships.
7. Ordering.
8. SEO, collapsed by default.

Editors must not have to scroll past advanced SEO settings before reaching the main content.

### 10.2 Hints

Use Decap's `hint` property for:

- explaining where a value appears;
- giving a realistic example;
- stating a recommended character range;
- explaining whether a field is public;
- clarifying the difference between saving a draft and publishing;
- explaining ordering values when numeric ordering is unavoidable.

Hints must be short and written in plain German.

Example:

```yaml
- label: Kurzbeschreibung
  name: summary
  widget: text
  hint: Wird auf Angebotskarten angezeigt. Empfohlen sind 90 bis 160 Zeichen.
```

### 10.3 Validation

Use Decap `pattern`, `required`, `min`, and `max` validation wherever possible.

At minimum:

- Email addresses must resemble valid email addresses.
- Telephone fields must reject placeholder text.
- SEO titles must not exceed 60 characters.
- SEO descriptions must not exceed 160 characters.
- Card summaries must not exceed 180 characters.
- Internal links must begin with `/`.
- External links must begin with `https://`.
- Image alt text must contain meaningful text and must not equal the filename.
- List fields must use appropriate minimum and maximum counts.
- End dates must not precede start dates; this is enforced by repository validation if Decap cannot enforce it in the form.

Validation messages must explain how to fix the problem. Do not use generic messages such as `Invalid value`.

### 10.4 Safe defaults

- New repeatable entries default to visible only after the editor intentionally publishes them through the editorial workflow.
- `published` may default to `true` because the editorial workflow itself protects drafts, but the hint must explain that turning it off hides an already published entry.
- New announcement banners default to disabled.
- New event state defaults to `scheduled`.
- Optional SEO objects are collapsed.
- Optional list objects are collapsed and display a useful summary.
- Image URL insertion must be disabled with `choose_url: false`; editors upload or select repository media instead.

### 10.5 Technical fields

The following must not appear as normal editor fields:

- `slug`
- file path
- image width
- image height
- `siteUrl`
- title template syntax
- map embed URL
- navigation route URL
- authentication-gateway endpoint
- Git branch
- internal schema version

If a technical field must be stored, use a hidden widget or derive it in code.

### 10.6 Rich text

- Long editorial copy must use a rich-text editor that serializes to Markdown.
- Available toolbar actions should be limited to those the website supports: bold, italic, links, headings 2 and 3, bulleted lists, numbered lists, and quotes.
- Heading level 1 must not be available in body content because page templates already render the page `h1`.
- Raw HTML and code blocks must not be offered.
- Content previews must sanitize rich text.

### 10.7 Lists and grouped fields

- Multi-field lists must use `collapsed: true` and a useful `summary`.
- Reordering controls must remain enabled when order affects the website.
- List add buttons must use a clear singular label such as `Preisoption hinzufügen`.
- Optional advanced objects must be collapsed and labeled, for example `SEO-Einstellungen`.

### 10.8 Relationships

Use relation widgets for references between collections.

The relation dropdown must display human-readable titles and store stable filenames/slugs. Editors must never copy a path from another screen.

Required relations include:

- Homepage to featured offers.
- Homepage to featured event.
- Event to related offer.
- Optional gallery image to a related event or horse if that relationship is implemented in the UI.

---

## 11. Shared SEO model

Each editable page, offer, and event must support a collapsed `seo` object.

| Field | Type | Required | Editor label | Behaviour |
|---|---|---:|---|---|
| `title` | string | No | SEO-Titel | Falls leer, sichtbaren Seitentitel verwenden |
| `description` | text | No | SEO-Beschreibung | Falls leer, Seiten-Kurztext verwenden |
| `socialImage` | image | No | Vorschaubild für Social Media | Falls leer, Hauptbild oder globales OG-Bild verwenden |
| `socialImageAlt` | string | Conditional | Alt-Text zum Vorschaubild | Pflicht, wenn ein eigenes Bild gesetzt ist |
| `noIndex` | boolean | No | Von Suchmaschinen ausschließen | Standard `false`; nur für Sonderfälle |

Requirements:

- Page metadata must be generated from this object with documented fallbacks.
- Dynamic offer and event pages must use the same fallback rules.
- The global site title template stays in application configuration, not in the CMS.
- SEO fields must show character guidance and validation.

---

## 12. Collection specification: Seiten

`Seiten` is a file collection. Each file exists before CMS launch.

### 12.1 Startseite

**File:** `content/pages/home.json`<br>
**CMS label:** `Startseite`

#### Fields

| Group | Field | Type | Required | UX notes |
|---|---|---|---:|---|
| Hero | `heroTitle` | string | Yes | Visible `h1`; recommended maximum 70 characters |
| Hero | `heroSubtitle` | text | Yes | One concise paragraph |
| Hero | `heroImage` | image | Yes | Main photographic image |
| Hero | `heroImageAlt` | string | Yes | Describes the scene, not the business slogan |
| Hero | `heroWatercolorImage` | image | Yes | Paired watercolor asset used by the transition effect |
| Hero | `primaryCtaLabel` | string | Yes | Recommended maximum 30 characters |
| Hero | `primaryCtaTarget` | select | Yes | Fixed list of valid public routes |
| Welcome | `welcomeEyebrow` | string | Yes | Short section label |
| Welcome | `welcomeTitle` | string | Yes | Section heading |
| Welcome | `welcomeBody` | richtext | Yes | Replaces the current paragraph array |
| Welcome | `welcomeImage` | image | Yes | Decorative or editorial image |
| Welcome | `welcomeImageAlt` | string | Yes | Required for editorial images; decorative images may use a dedicated decorative flag |
| Offers | `offersEyebrow` | string | Yes | Section label |
| Offers | `offersTitle` | string | Yes | Section heading |
| Offers | `featuredOffers` | relation list | Yes | Reference 1 to 3 published offers; maximum 3 |
| Event | `eventEyebrow` | string | Yes | Used when a featured event exists |
| Event | `featuredEvent` | relation | No | Reference one published event |
| Contact | `contactEyebrow` | string | Yes | Must actually render; remove if the design does not display it |
| Contact | `contactTitle` | string | Yes | Section heading |
| Contact | `contactBody` | text | Yes | Introductory paragraph |
| Contact | `contactImage` | image | Yes | Hof image |
| Contact | `contactImageAlt` | string | Yes | Meaningful alt text |
| Contact | `contactHighlights` | string list | No | Maximum 4 items |
| Contact | `contactCtaLabel` | string | Yes | CTA text |
| SEO | `seo` | object | No | Shared SEO object, collapsed |

#### Rendering requirements

- Every configured field must be used by `src/app/page.tsx`.
- The current unused secondary CTA and section-label fields must either be implemented or removed; no dead fields remain.
- The homepage shows exactly the offers selected by `featuredOffers`, in the selected order.
- If no featured event is selected, the event section is omitted without leaving an empty divider.
- An inactive or deleted relation must fail validation with a clear message rather than silently disappearing.

### 12.2 Über uns

**File:** `content/pages/about.json`<br>
**CMS label:** `Über uns`

| Field | Type | Required | UX notes |
|---|---|---:|---|
| `eyebrow` | string | Yes | Small heading above the page title |
| `title` | string | Yes | Page `h1` |
| `intro` | text | Yes | Page introduction |
| `philosophyEyebrow` | string | Yes | Section label |
| `philosophyTitle` | string | Yes | Section heading |
| `philosophyBody` | richtext | Yes | Main philosophy and history copy |
| `philosophyImage` | image | Yes | Supporting image |
| `philosophyImageAlt` | string | Yes | Meaningful alt text |
| `teamEyebrow` | string | Yes | Team section label |
| `teamTitle` | string | Yes | Team section heading |
| `teamIntro` | text | No | Optional introduction |
| `ctaLabel` | string | Yes | Contact CTA label |
| `seo` | object | No | Shared SEO object |

The team grid itself is populated from the Team collection. The hardcoded Mandy placeholder must be removed.

### 12.3 Kontakt

**File:** `content/pages/contact.json`<br>
**CMS label:** `Kontakt`

| Field | Type | Required | UX notes |
|---|---|---:|---|
| `eyebrow` | string | Yes | Page label |
| `title` | string | Yes | Page `h1` |
| `intro` | text | Yes | Introductory copy |
| `formEyebrow` | string | Yes | Form section label |
| `formTitle` | string | Yes | Form heading |
| `contactEyebrow` | string | Yes | Contact details section label |
| `contactTitle` | string | Yes | Contact details heading |
| `availabilityNote` | text | No | Optional note above or below contact information |
| `seo` | object | No | Shared SEO object |

The form fields, validation, steps, and mailto implementation remain in code. Offer choices are generated from published offers plus `Allgemeine Anfrage`; editors do not maintain a duplicated subject list.

### 12.4 Listing-page settings

The following files share a compact schema:

- `content/pages/offers.json`
- `content/pages/events.json`
- `content/pages/horses.json`
- `content/pages/prices.json`
- `content/pages/gallery.json`

Common fields:

| Field | Type | Required |
|---|---|---:|
| `eyebrow` | string | Yes |
| `title` | string | Yes |
| `intro` | text | Yes |
| `ctaTitle` | string | No |
| `ctaBody` | text | No |
| `ctaLabel` | string | No |
| `seo` | object | No |

Page-specific additions:

- Offers: section labels for seminar and workshop groups.
- Events: labels for upcoming and past events plus empty-state copy.
- Horses: empty-state and closing-card copy.
- Prices: pricing disclaimer and company-offer note.
- Gallery: category labels and empty-state copy.

---

## 13. Collection specification: Angebote

**Folder:** `content/offers`<br>
**Route:** `/angebote/{filename}`<br>
**Create entries:** Yes<br>
**Preview path:** `angebote/{{slug}}`

### 13.1 Fields

| Field | Type | Required | Editor label | Notes |
|---|---|---:|---|---|
| `title` | string | Yes | Titel | Generates filename only on creation |
| `published` | boolean | Yes | Auf Website anzeigen | Default `true`; editorial workflow still protects drafts |
| `category` | select | Yes | Kategorie | Values `seminar`, `workshop`; German display labels |
| `summary` | text | Yes | Kurzbeschreibung | Card copy, maximum 180 characters |
| `description` | text | Yes | Einleitung | Detail hero and metadata fallback |
| `body` | richtext | Yes | Ausführliche Beschreibung | Main detail-page content |
| `imageSrc` | image | Yes | Hauptbild | `choose_url: false` |
| `imageAlt` | string | Yes | Bildbeschreibung | Describe the visible image |
| `highlights` | list of strings | Yes | Das erwartet die Teilnehmer | 1 to 8 items |
| `audience` | list of strings | No | Zielgruppe | Collapsed when empty; maximum 8 |
| `format` | string | No | Format | Example shown in hint |
| `participantCount` | string | No | Teilnehmerzahl | Human-readable |
| `prerequisites` | text | No | Voraussetzungen | Optional |
| `specialNote` | text | No | Besonderer Hinweis | Optional |
| `pricingOptions` | object list | No | Preise | Replaces `content/prices` |
| `showOnPricesPage` | boolean | Yes | Auf der Preisseite anzeigen | Default `true` |
| `sortOrder` | number | Yes | Reihenfolge | Default 100; lower numbers appear first |
| `seo` | object | No | SEO-Einstellungen | Collapsed |

### 13.2 Pricing option fields

Each `pricingOptions` item contains:

| Field | Type | Required | Notes |
|---|---|---:|---|
| `label` | string | Yes | Example: `Tagesworkshop` |
| `price` | string | Yes | Supports `Preis auf Anfrage`, `ab 120 €`, or a fixed price |
| `unit` | string | No | Example: `pro Person` |
| `features` | list of strings | No | Maximum 8 |
| `highlighted` | boolean | Yes | Default `false`; at most one per offer |

The list must be collapsed by default and summarized as `{{label}} · {{price}}`.

### 13.3 Offer list UX

- Default sort: `sortOrder`, then title.
- Filters: visible/hidden and seminar/workshop.
- Groups: category.
- The list summary must show title and category.
- The editor preview must show the actual hero, summary, body, highlights, details panel, pricing and CTA treatment.

### 13.4 Offer validation

- Filename-derived slugs must be unique.
- At least one highlight is required.
- A selected image must exist in `public`.
- `showOnPricesPage: true` requires at least one pricing option.
- At most one pricing option may be highlighted per offer.
- The homepage may reference only published offers.

---

## 14. Collection specification: Veranstaltungen

**Folder:** `content/events`<br>
**Route:** `/veranstaltungen/{filename}`<br>
**Create entries:** Yes<br>
**Preview path:** `veranstaltungen/{{slug}}`

### 14.1 State model

Do not store `upcoming` or `past` manually. Those values become stale.

Store only an editorial state:

- `scheduled`
- `sold_out`
- `cancelled`

Derive chronology at build time:

- Upcoming: effective end date is today or later.
- Past: effective end date is before today.
- Cancelled: editorial state overrides chronology for labels and CTA behaviour.
- Sold out: remains in the upcoming list but displays the sold-out state and disables the registration CTA.

All date comparisons must use the `Europe/Berlin` calendar date explicitly.

### 14.2 Fields

| Field | Type | Required | Editor label | Notes |
|---|---|---:|---|---|
| `title` | string | Yes | Titel | Entry name |
| `published` | boolean | Yes | Auf Website anzeigen | Default `true` |
| `state` | select | Yes | Anmeldestatus | Scheduled, sold out, cancelled |
| `date` | datetime/date | Yes | Startdatum | Stored `YYYY-MM-DD` |
| `endDate` | datetime/date | No | Enddatum | Must be on or after start date |
| `startTime` | string | No | Beginn | `HH:mm`; omit for all-day events |
| `endTime` | string | No | Ende | `HH:mm` |
| `location` | string | Yes | Ort | Defaults to site location but remains editable |
| `category` | select | Yes | Kategorie | Seminar or workshop |
| `relatedOffer` | relation | No | Zugehöriges Angebot | Human-readable relation selector |
| `description` | text | Yes | Kurzbeschreibung | Card and metadata fallback |
| `body` | richtext | Yes | Ausführliche Beschreibung | Main event content |
| `imageSrc` | image | Yes | Hauptbild | Repository image only |
| `imageAlt` | string | Yes | Bildbeschreibung | Required |
| `highlights` | list | Yes | Highlights | 1 to 8 items |
| `capacity` | string | No | Teilnehmerzahl | Human-readable |
| `priceDisplay` | string | No | Preisangabe | Optional event-specific display price |
| `registrationLabel` | string | No | Text des Anmeldebuttons | Defaults to `Jetzt anmelden` |
| `sortOrder` | number | Yes | Reihenfolge bei gleichem Datum | Default 100 |
| `seo` | object | No | SEO-Einstellungen | Collapsed |

### 14.3 Event list UX

- Default sort: start date ascending for upcoming events, descending for past events.
- Filters: scheduled, sold out, cancelled, visible, hidden.
- Groups: year and category where supported.
- Summary: title, formatted date, state.
- Event preview must show date, place, state badge, main content, highlights and the exact CTA state.

### 14.4 Event validation

- End date must not precede start date.
- End time must not precede start time on a single-day event.
- Related offer must exist and be published.
- A sold-out or cancelled event must not render an active registration CTA.
- A featured homepage event must exist, be published, not be cancelled and not be past.

---

## 15. Collection specification: Team

**Folder:** `content/team`<br>
**Create entries:** Yes

| Field | Type | Required | Notes |
|---|---|---:|---|
| `name` | string | Yes | Identifier field |
| `published` | boolean | Yes | Label `Auf Website anzeigen` |
| `role` | string | Yes | Public role/title |
| `shortBio` | text | Yes | Card copy, maximum 220 characters |
| `body` | richtext | No | Optional longer biography |
| `imageSrc` | image | Yes | Portrait |
| `imageAlt` | string | Yes | Describe the person and context |
| `qualifications` | list of strings | No | Optional, maximum 8 |
| `sortOrder` | number | Yes | Default 100 |

Requirements:

- Mandy Kolatka must be migrated as the first real team entry.
- The existing placeholder biography must not remain anywhere in production.
- Team previews show the actual profile card and biography treatment.
- The About page lists all published team entries in `sortOrder` order.

---

## 16. Collection specification: Pferde

**Folder:** `content/horses`<br>
**Create entries:** Yes

| Field | Type | Required | Notes |
|---|---|---:|---|
| `name` | string | Yes | Identifier field |
| `published` | boolean | Yes | Website visibility |
| `breed` | string | Yes | Rasse |
| `birthYear` | number | No | Preferred over a manually maintained age |
| `ageText` | string | No | Used only when birth year is unknown or approximate |
| `character` | text | Yes | Character description |
| `roles` | list of strings | Yes | Einsatzbereiche; 1 to 6 items |
| `imageSrc` | image | Yes | Main portrait |
| `imageAlt` | string | Yes | Meaningful description |
| `sortOrder` | number | Yes | Default 100 |

Rules:

- Use `birthYear` when known and calculate the displayed age at build time.
- Do not require both `birthYear` and `ageText`; at least one must be present.
- Horse previews show the actual horse card.
- Existing Luna and Shadow content is migrated without URL changes.

---

## 17. Collection specification: Galerie

**Folder:** `content/gallery`<br>
**Create entries:** Yes

| Field | Type | Required | Notes |
|---|---|---:|---|
| `title` | string | Yes | Internal and optional visible title |
| `published` | boolean | Yes | Website visibility |
| `src` | image | Yes | Repository upload or existing asset |
| `alt` | string | Yes | Required accessibility description |
| `caption` | text | No | Optional visible caption |
| `category` | select | Yes | Hof, Pferde, Coaching, Workshops, Events |
| `relatedHorse` | relation | No | Optional |
| `relatedEvent` | relation | No | Optional |
| `sortOrder` | number | Yes | Default 100 |

Requirements:

- Editors do not enter image width or height.
- Width and height are determined by the validation/build layer.
- `choose_url` is disabled to prevent external tracking, broken embeds, and unknown image ownership.
- The collection list displays a thumbnail if Decap supports it without custom maintenance risk; otherwise it displays title and category.
- The preview shows the gallery tile, caption and lightbox content.

---

## 18. Collection specification: Hinweise & Banner

**Folder:** `content/announcements`<br>
**Create entries:** Yes

| Field | Type | Required | Notes |
|---|---|---:|---|
| `title` | string | Yes | Internal and small public label |
| `enabled` | boolean | Yes | Default `false` |
| `message` | text | Yes | Banner message, maximum 220 characters |
| `variant` | select | Yes | Information, Erfolg, Wichtig |
| `startDate` | date | No | Inclusive start date |
| `endDate` | date | No | Inclusive end date |
| `linkLabel` | string | No | Required when a target is set |
| `linkHref` | string | No | Internal `/...` or external `https://...` |
| `sortOrder` | number | Yes | Lower numbers first |

Requirements:

- An inactive banner must never render.
- An active banner without dates renders until manually disabled.
- Start and end dates are interpreted in `Europe/Berlin`.
- Link label and link target are either both present or both absent.
- End date must not precede start date.
- The CMS hint must explain that scheduled visibility relies on the daily static rebuild.

---

## 19. Collection specification: Website-Einstellungen

**File:** `content/settings/site.json`<br>
**CMS label:** `Kontakt & Website`

### 19.1 Fields

| Group | Field | Type | Required | Notes |
|---|---|---|---:|---|
| Identity | `businessName` | string | Yes | Public business name |
| Contact | `phone` | string | Yes | Public telephone number |
| Contact | `email` | string | Yes | Public email and mailto destination |
| Contact | `availabilityText` | string | Yes | Example: `Termine nach Vereinbarung` |
| Contact | `footerNote` | text | Yes | Short supporting note |
| Address | `street` | string | Yes | Structured address |
| Address | `postalCode` | string | Yes | German postal code validation |
| Address | `city` | string | Yes | City |
| Address | `countryCode` | select | Yes | Default and only expected value `DE` |
| Location | `mapLocation` | map/Point | Yes | Editor chooses the location on an interactive map |
| SEO | `defaultDescription` | text | Yes | Global metadata fallback |
| SEO | `defaultSocialImage` | image | Yes | Global OG fallback |
| SEO | `defaultSocialImageAlt` | string | Yes | Alt text |

### 19.2 Derived values

The application derives:

- formatted full address;
- `tel:` link from the telephone number;
- `mailto:` destination from the email;
- OpenStreetMap embed URL from `mapLocation`;
- LocalBusiness JSON-LD address fields;
- contact form offer subjects from the Offers collection;
- the footer copyright business name.

### 19.3 Values not editable here

- `siteUrl`
- title template
- navigation structure
- authentication-gateway configuration
- logo paths
- map embed HTML
- separate display and mailto email addresses

These are fixed or derived to prevent accidental site breakage.

---

## 20. Collection specification: Rechtliches

### 20.1 Structured legal settings

**File:** `content/settings/legal.json`<br>
**CMS label:** `Unternehmensangaben`

| Field | Type | Required |
|---|---|---:|
| `legalName` | string | Yes |
| `legalForm` | string | No |
| `registerCourt` | string | No |
| `registerNumber` | string | No |
| `taxNumber` | string | No |
| `managingPersons` | list of strings | Yes |
| `contentResponsibleName` | string | Yes |
| `contentResponsibleAddress` | text | Yes |

Public telephone, email and business address come from site settings and must not be duplicated.

### 20.2 Legal page content

**Files:**

- `content/legal/imprint.md`
- `content/legal/privacy.md`

Each contains:

- `title`
- `lastReviewedAt`
- `reviewedBy`
- `body` as rich text/Markdown

Requirements:

- Each editor form displays a prominent hint that legal changes require professional review.
- Page templates inject structured company and contact fields where possible instead of duplicating them inside prose.
- Existing hardcoded legal copy is migrated before the old JSX is removed.
- No CMS or implementation claim may imply that the copy is legally sufficient merely because it is present.

---

## 21. CMS editor UX specification

### 21.1 Design direction

The admin experience should be calm, content-first, accessible, and familiar. It should not attempt to reproduce the public site's decorative watercolor design inside the CMS shell.

Use the See-Pferde logo and German localization while preserving the editor's familiar core controls. Vendor credits and provider branding are not shown to the owner. Custom styling must not reduce contrast, hide focus indicators, or make upgrades fragile.

### 21.2 Login experience

- Show the current logo using Decap's supported `logo` configuration.
- Page title: `Website-Verwaltung | See-Pferde Zwenkau`.
- The editor entry button is labeled `Mit Benutzername und Passwort anmelden`; it has no GitHub icon or vendor name.
- The popup uses a branded German form with `Benutzername`, `Passwort`, a password-visibility control, a loading state, generic credential errors, and a clear success state.
- Use `autocomplete="username"` and `autocomplete="current-password"`, explicit labels, visible focus states, associated help text, and live error/status regions.
- Password recovery is administrator-managed for the initial single-account release; the form tells the owner to contact the website administrator.
- Add `noindex,nofollow`.
- Authentication failures must lead to a short troubleshooting page or documentation link rather than a blank screen.
- The gateway must return clear German error descriptions without exposing secrets or distinguishing an unknown username from a wrong password.
- Five failed attempts from the same client within 15 minutes trigger a 15-minute lockout by default.

### 21.3 Sidebar and navigation

- Use the collection order defined in section 8.
- Do not expose experimental or unused collections.
- Use singular add-button labels such as `Angebot erstellen` and `Veranstaltung erstellen`.
- Keep `Website-Einstellungen` and `Rechtliches` visually and positionally separate from everyday content.
- The configured `display_url` must provide a visible link back to the public site.

### 21.4 Form usability

- Put the most recognizable field first: title, event name, horse name, or team member name.
- Group related fields into objects only when that reduces scanning effort.
- Keep a form's main editorial fields expanded.
- Collapse SEO and rarely used details.
- Do not create deeply nested structures beyond two levels.
- Provide realistic examples in hints instead of implementation terminology.
- Prefer select, relation, date, map and image widgets over free-text input.
- Validate on field blur where supported and always before save.
- Preserve entered content if validation fails.
- Long forms must remain understandable when read top to bottom without documentation.

### 21.5 Terminology

Use these standard terms consistently:

| Concept | CMS wording |
|---|---|
| Public visibility | `Auf Website anzeigen` |
| Save draft | `Entwurf speichern` |
| Ready for review | `Zur Prüfung bereit` |
| Publish | `Veröffentlichen` |
| Primary image | `Hauptbild` |
| Image alt text | `Bildbeschreibung für Barrierefreiheit` |
| Card summary | `Kurzbeschreibung` |
| Body | `Ausführlicher Inhalt` |
| Sort order | `Reihenfolge` |
| SEO group | `SEO-Einstellungen` |

Avoid mixing `Veröffentlicht`, `Aktiv`, `Sichtbar`, and `Online` for the same concept.

### 21.6 Preview UX

Create CMS preview templates for:

- Homepage
- About page
- Offers
- Events
- Team profiles
- Horse profiles
- Gallery entries
- Announcements

The preview must:

- use the site's primary type scale, colors, spacing and card shapes;
- render rich text using the same semantic structure as the site;
- show image cropping approximately as it appears publicly;
- show empty optional sections as absent, not as placeholder boxes;
- display event state and CTA behaviour;
- display offer pricing and highlights;
- show a clear note that navigation, animation and full responsive behaviour are represented approximately;
- never execute arbitrary HTML from content.

Use `CMS.registerPreviewStyle` and `CMS.registerPreviewTemplate`. Keep preview code in versioned files rather than a large inline script.

Recommended files:

```text
public/admin/index.html
public/admin/preview.css
public/admin/preview.js
```

Published content links must use `site_url` and collection `preview_path` values so editors can open the real page directly.

### 21.7 Accessibility

Custom CMS additions and previews must meet these requirements:

- Visible keyboard focus on every interactive element.
- Logical tab order matching the visual order.
- No keyboard traps.
- Text contrast of at least 4.5:1 for normal text.
- Minimum 44 by 44 px target size for custom interactive controls.
- Form labels remain programmatically associated with inputs.
- Validation is announced and not conveyed by color alone.
- Custom preview headings follow `h1`, `h2`, `h3` order.
- Motion respects `prefers-reduced-motion`.
- Images include alt text or are intentionally decorative.

### 21.8 Responsive use

The CMS must be manually tested at:

- 375 px wide phone portrait;
- 768 px tablet portrait;
- 1024 px laptop/tablet landscape;
- 1440 px desktop.

The primary supported editing experience is desktop and tablet. Mobile must remain usable for small corrections and emergency banner changes, but complex page composition on a phone is not a primary requirement.

### 21.9 Loading and error feedback

- Login, collection loading, media upload and publishing must never appear frozen.
- Preserve Decap's loading indicators unless a tested replacement is provided.
- Custom previews must show an explicit fallback when an image or relation is missing.
- Build-validation errors must identify the collection, entry filename and field path.
- Deployment failures must link to the relevant GitHub Actions run in administrator documentation.

---

## 22. Content loading and validation

### 22.1 Module structure

Refactor the current monolithic loader into:

```text
src/lib/content/
├── index.ts
├── readers.ts
├── schemas.ts
├── selectors.ts
├── dates.ts
├── images.ts
└── errors.ts
```

Responsibilities:

- `readers.ts`: JSON and Markdown file IO.
- `schemas.ts`: runtime schemas and TypeScript inference.
- `selectors.ts`: published/visible, featured, category and chronological queries.
- `dates.ts`: `Europe/Berlin` date handling.
- `images.ts`: image existence and dimensions.
- `errors.ts`: consistent, editor-readable validation errors.
- `index.ts`: stable public exports for pages and components.

### 22.2 Schema validation

Use a runtime schema library such as Zod rather than relying only on TypeScript casts.

Validation must cover:

- required field presence;
- exact enum values;
- string length;
- date and time format;
- date ordering;
- URL form;
- email form;
- image existence;
- image dimensions;
- relation integrity;
- filename/slug uniqueness;
- placeholder values;
- pricing invariants;
- homepage selection limits;
- published-reference validity.

### 22.3 Error format

Build errors must resemble:

```text
Content validation failed

content/events/extreme-trail-fruehling-2026.md
  - endDate: Das Enddatum darf nicht vor dem Startdatum liegen.
  - imageAlt: Bitte beschreiben Sie, was auf dem Bild zu sehen ist.
```

The validator should collect all content errors in one run where practical rather than stopping after the first file.

### 22.4 Placeholder protection

Production validation must reject values containing known placeholders, including:

- `[wird ergänzt]`
- `kontakt@example.com`
- `[Hier folgt ...]`
- `YOUR_GITHUB_ORG`
- `YOUR_REPOSITORY`
- `CMS_OAUTH_HOST`
- `REPLACE_WITH_GITHUB_APP_ID`
- `REPLACE_WITH_INSTALLATION_ID`

Authentication placeholder validation applies to the deployed admin config and private launch checklist; content placeholder validation applies to public content.

### 22.5 Route slugs

- Readers derive folder-entry slugs from `path.basename(filePath, extension)`.
- Frontmatter slug values are not used for routing after migration.
- `generateStaticParams` uses the filename-derived slug.
- Dynamic offer and event routes set `dynamicParams = false`.
- Duplicate or invalid slugs fail validation.

---

## 23. Date and scheduled-content behaviour

### 23.1 Time zone

All public date-state decisions use `Europe/Berlin`, not the GitHub Actions runner's local time and not an implicit UTC conversion.

Create one tested helper that returns the current calendar date in `Europe/Berlin`. All announcement and event selectors must use it.

### 23.2 Daily rebuild

The deployment workflow must include a scheduled trigger once daily. The scheduled build ensures:

- expired announcements disappear;
- scheduled announcements appear;
- events move from upcoming to past;
- age values derived from a year remain current after the new year.

The exact UTC schedule may shift relative to local time during daylight-saving changes; the only requirement is that it runs once during the low-traffic overnight period.

### 23.3 Manual override

- Announcements retain an explicit `enabled` switch.
- Events retain `cancelled` and `sold_out` editorial states.
- Chronological upcoming/past state is never manually editable.

---

## 24. Media handling

### 24.1 Upload rules

- Repository media path: `public/images/uploads`.
- Public media path: `/images/uploads`.
- Maximum upload size: 2.5 MB per image for the initial implementation.
- Recommended maximum dimensions: 2400 px on the longest edge.
- Recommended formats: WebP or high-quality JPEG for photographs; SVG only for trusted brand assets.
- External image URLs are disabled.
- Alt text is mandatory for every non-decorative editorial image.

### 24.2 Validation

The build must reject:

- missing images;
- unsupported or unreadable image files;
- zero dimensions;
- files above the hard maximum defined for production;
- images referenced outside approved public media paths;
- missing alt text.

Images above the recommended dimensions may initially produce a warning rather than an error if they remain below the file-size limit.

### 24.3 Derived dimensions

The image validation layer reads width and height from the file. Gallery components receive derived dimensions or use a layout that does not require editors to enter them.

### 24.4 Public directory cleanup

Before CMS launch:

- Move raw reference photography out of `public/reference`.
- Move source-generation folders such as `public/new_images_190326` out of the deployed public tree.
- Move `public/images/_originals` out of the deployed public tree after confirming backups.
- Keep only files required by public pages or the CMS media library in `public`.
- Do not delete source assets without confirming an external or repository backup.

The current export size is too large for a media-managed static site. The target production `out/` size must be documented after cleanup, and unexplained growth must fail or warn in CI.

Baseline measured during this specification review:

- `out/`: approximately 219 MB;
- `public/reference`: approximately 56 MB;
- `public/images`: approximately 66 MB.

These values include current working-tree assets and are diagnostic baselines, not target budgets.

---

## 25. Authentication and security

### 25.1 GitHub App

Create a GitHub App named clearly, for example `See-Pferde Website CMS`, and install it only on `kagruni/seepferde`.

Repository permissions:

- Metadata: read-only, granted automatically.
- Contents: read and write.
- Pull requests: read and write.
- Issues: read and write, required for editorial-workflow labels.
- Commit statuses: read-only, required for build/preview status display.

No webhook, OAuth callback, user authorization, organization-wide repository access, Actions write permission, administration permission, or account permission is required. Store the App ID, installation ID, and generated private key only in the private cPanel configuration directory.

### 25.2 Username/password gateway

The cPanel-hosted gateway consists of:

- `/cms-auth/form`: a branded login endpoint compatible with the editor's authentication handshake;
- `/cms-auth/repository/user`: a synthetic CMS user profile for the authenticated owner;
- `/cms-auth/repository/*`: an allowlisted same-origin proxy for the repository endpoints the editor requires.

The public route names intentionally avoid `auth`, `login`, and `api` path
segments because the current cPanel ModSecurity policy rejects those paths with
HTTP 406 before PHP executes.

The gateway must:

- load configuration from `CMS_AUTH_CONFIG` or `~/.config/seepferde-cms/config.php`;
- refuse configuration and private-key files located under the document root;
- verify passwords with `password_verify()` and store no plaintext password;
- use a session cookie only for CSRF protection during the login form;
- issue signed opaque CMS sessions restricted by issuer, site, username, repository, issued-at, not-before, and expiration claims;
- accept CMS sessions only through the `Authorization` header, not a repository-operation cookie;
- validate the request origin when it is present;
- rate-limit failed logins without logging submitted passwords;
- mint GitHub App installation tokens only server-side and restrict each request to the configured repository;
- reject path traversal, other repositories, and GitHub API resources not required by the editor;
- rewrite API pagination links so subsequent requests remain inside the gateway;
- use `no-store`, strict browser security headers, generic public errors, and HTTPS only;
- avoid logging CMS sessions, passwords, password hashes, private keys, or GitHub tokens.

### 25.3 Owner account lifecycle

- Provision the account with `php scripts/create-cms-config.php`; the password is entered interactively and hidden.
- Use a unique password of at least 12 characters, preferably generated by a password manager.
- Reset the password by rerunning the provisioning command with `--force`; this also rotates the CMS session secret and invalidates all existing logins.
- Disable the account by moving the private config out of place or changing its permissions so the gateway cannot read it.
- Rotate the GitHub App private key independently and delete the old key in GitHub after the new key works.
- The owner never receives GitHub organization membership, collaborator access, a personal access token, or the App private key.

### 25.4 Repository and branch protection

- Install the App only on the selected repository.
- Keep main branch protection enabled.
- Require successful content, type, lint, and build checks before merge.
- Decide explicitly whether the App may merge after checks pass or whether a GitHub administrator performs the final merge.
- Document account reset, App removal, and emergency secret rotation.

### 25.5 Admin route

- `/admin/` is publicly reachable but all repository operations require authentication.
- `noindex` is a search-engine directive, not a security control.
- Never put password hashes, CMS session secrets, GitHub tokens, App private keys, or deployment secrets in `config.yml`, JavaScript, HTML, `public/`, or public environment variables.

---

## 26. CI/CD specification

### 26.1 Pull-request validation workflow

Run on every pull request that changes content, admin configuration, application code, or dependencies.

Steps:

1. Checkout.
2. Set up the pinned Node version.
3. Run `npm ci`.
4. Run content validation.
5. Run ESLint.
6. Run TypeScript validation.
7. Run the static production build.
8. Save the build result or summary for review.

This workflow must not deploy to production.

### 26.2 Production workflow

Run on:

- push to `main`;
- manual dispatch;
- daily schedule.

Steps:

1. Checkout.
2. Set up Node.
3. Install dependencies using `npm ci`.
4. Validate content.
5. Build.
6. Verify expected output exists.
7. Deploy `out/` to cPanel using rsync.
8. Record a clear success or failure summary.

### 26.3 Concurrency

Use a production deployment concurrency group with `cancel-in-progress: false`. A new publication queues behind an active deployment instead of interrupting an in-progress rsync.

### 26.4 Deployment safety

- Deployment secrets remain GitHub Actions secrets.
- The production job uses a GitHub environment named `production` if available.
- A failed build never runs rsync.
- A failed scheduled build must not remove the previously deployed site.
- `--delete` remains permitted only because `out/` is the complete desired static state.

### 26.5 Preview deployments

In-CMS previews are required for launch. Remote pull-request preview deployments are recommended but optional for the first complete release.

If remote previews are added:

- publish them to an isolated preview host or path;
- report the preview URL as a GitHub commit status;
- configure Decap `preview_context` if automatic detection is unreliable;
- set collection `preview_path` values so preview links open the edited entry.

---

## 27. Website rendering requirements

### 27.1 Static content consumption

- Pages import typed selectors from `@/lib/content`.
- No page imports raw JSON or Markdown directly.
- Client components receive serialized public data through props or the existing site-data provider.
- No filesystem API reaches a client bundle.

### 27.2 Page coverage

After implementation, these pages must contain no normal editorial copy hardcoded in JSX:

- `/`
- `/ueber-uns`
- `/angebote`
- `/angebote/[slug]`
- `/veranstaltungen`
- `/veranstaltungen/[slug]`
- `/pferde`
- `/preise`
- `/galerie`
- `/kontakt`
- `/impressum`
- `/datenschutz`

Small reusable UI labels such as `Mehr erfahren`, `Zurück`, `Datum`, and form field labels remain in code.

### 27.3 Empty states

Every collection-backed page must handle zero visible entries without broken grids or empty section dividers.

Examples:

- No upcoming events: show the configured events empty-state copy.
- No team entries: omit the team grid and fail launch validation if About content implies a team exists.
- No prices: show `Preise auf Anfrage` content rather than an empty pricing grid.
- No featured event: omit the homepage event section.

### 27.4 Contact form

- Continue using the current client-side mailto flow unless a separate form service is explicitly approved.
- Use the single site-settings email value for visible email and mailto destination.
- Generate offer subjects from published offers.
- Add `Allgemeine Anfrage` as a code-defined fallback subject.
- Event and offer CTA buttons preselect the corresponding visible title.
- Do not expose form implementation or destination syntax to ordinary editors.

---

## 28. Migration plan

### Phase 1: Foundation

1. Create a dedicated implementation branch.
2. Preserve the user's current unrelated working-tree changes.
3. Record the current production URLs and build output.
4. Add runtime schemas and content validation without changing output.
5. Add PR validation before making new CMS fields available.

### Phase 2: Content model

1. Create `content/pages` files from current hardcoded page copy.
2. Create `content/team` and migrate Mandy's real biography when provided.
3. Create structured legal settings and legal body files.
4. Merge each price record into its matching offer.
5. Convert homepage featured flags to relations.
6. Rename event `kategorie` to `category`.
7. Replace manual event chronology with the new state model.
8. Replace horse age with birth year or approved age text.
9. Remove gallery width and height from the editorial schema.

Migration mappings:

| Current source | Target | Rule |
|---|---|---|
| `content/settings/home.json` | `content/pages/home.json` | Preserve visible copy; remove fields that are not rendered |
| `content/settings/site.json.address` | Structured address object | Split into street, postal code, city and country |
| `content/settings/site.json.mapEmbedUrl` | `mapLocation` | Extract and verify the actual point on the map |
| `content/settings/site.json.contactSubjects` | Derived subjects | Generate from published offers plus `Allgemeine Anfrage` |
| `content/settings/site.json.navLinks` | Code-owned navigation | Preserve the current route set in application code |
| `content/prices/{slug}.md` | Matching offer `pricingOptions` | Match by existing slug; fail migration if no unique offer exists |
| Offer `featured` flags | Homepage `featuredOffers` relation | Preserve the three offers currently shown and their order |
| Event `featured` flags | Homepage `featuredEvent` relation | Preserve only a valid future, published event |
| Event `status: upcoming` or `past` | `state: scheduled` | Chronology becomes derived from dates |
| Event `status: cancelled` | `state: cancelled` | Preserve cancellation |
| Event `kategorie` | `category` | Preserve enum value and change the key |
| Horse `age` | `birthYear` or `ageText` | Do not infer birth year without confirmation; keep current text if uncertain |
| Horse `role` | `roles` list | Split only where the meaning remains clear |
| Gallery `width` and `height` | Derived metadata | Read from the image file |
| Gallery `category: unterricht` | Approved new category | Review each image; do not apply a blind global mapping |
| Hardcoded About copy | `content/pages/about.json` | Preserve reviewed copy and replace the Mandy placeholder |
| Hardcoded legal copy | Legal content files | Preserve exact current text before legal review |

### Phase 3: Application integration

1. Refactor content loaders and selectors.
2. Update all public pages to use page content files.
3. Update dynamic routes to use filename-derived slugs.
4. Update metadata generation.
5. Update site settings and JSON-LD.
6. Update contact form subject generation.
7. Add empty states.

### Phase 4: CMS UX

1. Rebuild `config.yml` in the defined collection order.
2. Add German labels, hints, summaries, defaults, filters and groups.
3. Add relation widgets.
4. Add field validation.
5. Pin and test Decap.
6. Add custom previews and preview styling.
7. Add admin metadata and branding.
8. Remove the duplicate Next admin route.

### Phase 5: Media and automation

1. Move non-public source media out of `public` after backup confirmation.
2. Add file-size and dimension validation.
3. Add the daily scheduled build.
4. Add deployment concurrency.
5. Add output-size reporting.

### Phase 6: Authentication and launch

1. Create the repository-scoped GitHub App with the permissions in section 25.
2. Install it only on `kagruni/seepferde` and generate its private key.
3. Upload the private key outside `public_html` with mode `0600`.
4. Provision the owner username/password with `scripts/create-cms-config.php`.
5. Verify `/cms-auth/form`, `/cms-auth/repository/user`, rate limiting, session expiration, and rejected access to another repository.
6. Test owner login without any GitHub account or repository membership.
7. Run the complete editorial workflow on staging or a safe test entry.
8. Publish, validate and deploy one representative change.
9. Confirm the live site, password reset, account disablement, App-key rotation, and rollback procedures.
10. Train editors using the scenarios in section 30.

### Phase 7: Cleanup

Only after parity and production verification:

- Delete `content/prices`.
- Delete obsolete frontmatter slug fields.
- Delete old unused settings keys.
- Delete the Next admin redirect page.
- Remove obsolete loader code.
- Update `CMS_SETUP.md` to a concise operational guide pointing to this specification.

---

## 29. File change map

### 29.1 Expected new files

```text
CMS_IMPLEMENTATION_SPEC.md
content/pages/*.json
content/settings/legal.json
content/team/*.md
content/legal/imprint.md
content/legal/privacy.md
public/admin/preview.css
public/admin/preview.js
public/cms-auth/.htaccess
public/cms-auth/_bootstrap.php
public/cms-auth/auth.php
public/cms-auth/api.php
cms-auth/config.example.php
src/lib/content/readers.ts
src/lib/content/schemas.ts
src/lib/content/selectors.ts
src/lib/content/dates.ts
src/lib/content/images.ts
src/lib/content/errors.ts
scripts/validate-content.ts
scripts/create-cms-config.php
scripts/dev-with-cms.mjs
tests/cms-auth-test.php
```

### 29.2 Expected modified files

```text
public/admin/index.html
public/admin/config.yml
.github/workflows/deploy.yml
package.json
content/settings/site.json
content/offers/*.md
content/events/*.md
content/horses/*.md
content/gallery/*.md
content/announcements/*.md
src/lib/content/index.ts
src/types/index.ts
src/app/layout.tsx
src/app/page.tsx
src/app/ueber-uns/page.tsx
src/app/angebote/page.tsx
src/app/angebote/[slug]/page.tsx
src/app/veranstaltungen/page.tsx
src/app/veranstaltungen/[slug]/page.tsx
src/app/pferde/page.tsx
src/app/preise/page.tsx
src/app/galerie/page.tsx
src/app/kontakt/page.tsx
src/app/impressum/page.tsx
src/app/datenschutz/page.tsx
src/components/layout/Footer.tsx
src/components/ui/MultiStepForm.tsx
src/components/common/Map.tsx
package.json
package-lock.json
.github/workflows/deploy.yml
CMS_SETUP.md
```

### 29.3 Expected removed files/directories

```text
src/app/admin/page.tsx
content/prices/
```

Removal occurs only after the replacement path is verified.

---

## 30. Testing plan

### 30.1 Automated content tests

Test at minimum:

- valid and invalid page settings;
- duplicate filenames/slugs;
- missing images;
- missing alt text;
- invalid relations;
- invalid email and link formats;
- start/end date ordering;
- Berlin date boundaries;
- upcoming/past event derivation;
- scheduled announcement boundaries;
- multiple highlighted price options;
- hidden entries excluded from selectors;
- invalid homepage featured selections;
- metadata fallbacks;
- rejection of known placeholders.

### 30.2 Build verification

Required commands:

```bash
npm run content:validate
npm run lint
npm run typecheck
npm run build
git diff --check
```

The build must generate all expected offer and event routes and no obsolete routes.

### 30.3 Manual CMS scenarios

An editor unfamiliar with the repository must complete these scenarios without source-code help:

1. Change the homepage hero title, preview it, save a draft and publish it.
2. Add a new offer with one price option and feature it on the homepage.
3. Create an event related to an offer and mark it sold out.
4. Add a team member with a portrait and biography.
5. Hide a horse without deleting it.
6. Upload a gallery image, provide alt text and assign a category.
7. Schedule an announcement with a link.
8. Update telephone, email and map location.
9. Edit an SEO description.
10. Open the published public page from the CMS.

For each scenario, record:

- completion success;
- points where the editor hesitated;
- validation clarity;
- preview usefulness;
- total time;
- any terminology the editor did not understand.

Revise labels and hints before launch if the same confusion appears more than once.

### 30.4 Accessibility QA

- Complete one offer edit using keyboard only.
- Complete one media selection using keyboard only.
- Confirm focus visibility.
- Confirm validation errors are reachable and announced.
- Confirm preview heading order.
- Confirm minimum contrast.
- Test at 200% browser zoom.
- Test reduced-motion behaviour for custom preview UI.

### 30.5 Deployment QA

1. Save draft: production remains unchanged.
2. Mark ready for review: pull request and checks appear.
3. Publish: main receives the content change.
4. Build failure: deployment does not run.
5. Build success: rsync updates production.
6. Two publications close together: deployments run sequentially.
7. Daily scheduled build: date-driven content changes without a content commit.
8. Rollback: reverting the content commit restores the previous site.

---

## 31. Acceptance criteria

The CMS is complete only when all of the following are true.

### 31.1 Content coverage

- All normal editorial content on all public pages is CMS-backed.
- No production placeholders remain.
- Prices exist in offers, not a duplicated collection.
- About, team and legal content are migrated.
- Every CMS field changes a visible or documented behaviour.

### 31.2 Editor UX

- All UI labels and hints are German.
- Collections appear in the required order.
- No normal editor must enter a slug, image dimension, raw map URL or route URL.
- Featured content uses relations.
- Advanced SEO fields are collapsed.
- Main content types have useful previews.
- Validation messages identify the field and correction.
- The ten manual editor scenarios are successfully completed.

### 31.3 Technical quality

- Runtime content schemas validate every content type.
- `npm run content:validate`, lint and build pass.
- Dynamic routes use filename-derived stable slugs.
- Date comparisons use `Europe/Berlin`.
- Hidden and invalid content does not render.
- Existing public URLs remain valid.

### 31.4 Operations

- The owner can sign in with the configured username/password and has no GitHub account or repository access.
- The browser receives no GitHub installation token, App private key, password hash, or permanent repository credential.
- The gateway accepts only valid, unexpired, site- and repository-bound CMS sessions.
- Requests for another repository or non-allowlisted GitHub API resource are rejected.
- Failed logins are rate-limited and password reset invalidates existing sessions.
- No authentication or deployment secrets are public.
- Editorial workflow creates reviewable changes.
- Pull-request validation runs before publication.
- Production builds are serialized.
- Daily scheduled builds run successfully.
- A tested rollback procedure exists.

### 31.5 Media and performance

- Upload size is limited.
- External image URLs are disabled.
- Image dimensions are derived.
- Alt text is required.
- Raw reference and original media is not copied into production output.
- The final production output size is measured and documented.

---

## 32. Required launch inputs

The implementation can proceed before all business content is final, but launch requires:

- Final public telephone number.
- Final public email address, which is also used as the mailto destination.
- Approved Mandy Kolatka biography.
- Confirmed team member information.
- Confirmed horse information.
- Reviewed legal copy.
- GitHub App ID, installation ID, and private key for the selected repository.
- Owner username, display name, and an administrator-provisioned password.
- Confirmed cPanel home path for the private gateway configuration outside `public_html`.
- cPanel deployment secrets.
- Confirmation of who may publish rather than only draft.
- Confirmation that the 2.5 MB image upload limit is acceptable.

---

## 33. Editorial documentation deliverables

In addition to implementation, provide a short German editor guide covering:

1. Login.
2. Editing an existing page.
3. Creating an offer or event.
4. Selecting homepage features.
5. Uploading images and writing alt text.
6. Saving a draft.
7. Requesting review.
8. Publishing.
9. Recognizing build and deployment success.
10. Contacting the administrator after an error.

The editor guide must use screenshots from the finished CMS, not generic Decap screenshots.

Provide a separate administrator runbook covering owner-account provisioning and reset, GitHub App permissions and key rotation, failed builds, rollback, scheduled builds, media cleanup and editor upgrades.

---

## 34. Implementation principles

1. **Prefer configuration over custom widgets.** Use Decap's standard widgets, hints, relations, summaries and previews before introducing custom controls.
2. **Do not expose internal architecture.** Editors work with visible business concepts.
3. **One source of truth.** Contact details, prices and featured selections are not duplicated.
4. **Fail before deployment.** Invalid content is a build error, not a broken live page.
5. **Preserve URLs.** Content-model cleanup must not create avoidable SEO regressions.
6. **Keep the site static.** CMS completion must not add public server dependencies.
7. **Design for occasional use.** Labels and hints must still make sense after an editor has not logged in for months.
8. **Accessible by default.** Custom UX must preserve keyboard use, focus, contrast and semantics.
9. **Preview what matters.** Previews should answer “What will visitors see?” rather than simulate every interaction.
10. **Document operational ownership.** Authentication, publishing, deployment and rollback each require a named owner.

---

## 35. Official Decap references

- [GitHub backend](https://decapcms.org/docs/github-backend/)
- [Backend overview and GitHub OAuth proxy](https://decapcms.org/docs/backends-overview/)
- [GitHub App installation authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation)
- [Generate a GitHub App installation token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Editorial workflow](https://decapcms.org/docs/editorial-workflows/)
- [Configuration options](https://decapcms.org/docs/configuration-options/)
- [File collections](https://decapcms.org/docs/collection-file/)
- [Folder collections](https://decapcms.org/docs/collection-folder/)
- [Widgets and field validation](https://decapcms.org/docs/widgets/)
- [Richtext widget](https://decapcms.org/docs/widgets/richtext/)
- [Relation widget](https://decapcms.org/docs/widgets/relation/)
- [List widget](https://decapcms.org/docs/widgets/list/)
- [Image widget and upload limits](https://decapcms.org/docs/widgets/image/)
- [Custom preview templates](https://decapcms.org/docs/customization/)
- [Deploy preview links](https://decapcms.org/docs/deploy-preview-links/)
- [Local repository proxy](https://decapcms.org/docs/decap-proxy/)
