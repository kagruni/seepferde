# Reiterhof Mandy Kolatka — Projektübersicht

## Was ist dieses Projekt?

Website für den **Reiterhof Mandy Kolatka**, einen familiären Reiterhof in Zwenkau bei Leipzig.
Die Seite richtet sich an Familien, Kinder und Reitbegeisterte, die Reitunterricht oder Ponyreiten suchen.

**Domain:** `mandykolatka.kajik.dev`
**Sprache:** Deutsch (de)
**Standort:** Hafenstraße 20, 04442 Zwenkau, Deutschland

---

## Tech-Stack

| Technologie | Version | Hinweise |
|---|---|---|
| Next.js | 16.1.6 | App Router, Static Export (`output: "export"`) |
| React | 19.2.3 | |
| TypeScript | ^5 | Strict mode |
| Tailwind CSS | v4 | via `@tailwindcss/postcss` |
| ESLint | ^9 | `eslint-config-next` |

### Wichtige Konfigurationen

- **Static Export:** Die Seite wird als statisches HTML exportiert (`next.config.ts` → `output: "export"`). Kein Server-Side Rendering, keine API-Routes. Formulare müssen client-seitig funktionieren (z.B. via mailto, Formspree, Netlify Forms oder ähnliches).
- **Path Aliases:** `@/*` → `./src/*`
- **Fonts:** Aktuell Geist/Geist_Mono — soll durch passende Schriftarten ersetzt werden (siehe Design).
- **PostCSS:** Konfiguriert über `postcss.config.mjs`.

---

## Seitenstruktur

Die Website soll folgende Seiten/Sektionen enthalten:

### Startseite (`/`)
- Hero-Bereich mit großem Bild (Pferde auf der Koppel, Reiterhof-Atmosphäre)
- Kurze Willkommensnachricht / Über uns Teaser
- Übersicht der Angebote (Karten mit Links zu den Details)
- Kontakt-Teaser mit Adresse und Telefonnummer
- Call-to-Action: "Schnupperstunde vereinbaren"

### Über uns (`/ueber-uns`)
- Geschichte des Reiterhofs
- Philosophie: Behutsamer Umgang mit Pferden, familienfreundliche Atmosphäre
- Vorstellung von Mandy Kolatka (Inhaberin / Reitlehrerin)
- Team (falls weitere Personen)

### Angebote (`/angebote`)
Unterseiten oder Sektionen für jedes Angebot:

#### Reitunterricht (`/angebote/reitunterricht`)
- **Anfänger:** Grundlagen des Reitens, Umgang mit dem Pferd, Schritt/Trab
- **Fortgeschrittene:** Dressur, Springen, Geländereiten
- **Einzelunterricht & Gruppenunterricht** (max. Gruppengrößen angeben)
- **Longenstunden:** Für absolute Anfänger an der Longe
- Schnupperstunden: Einmalige Probestunde zum Kennenlernen

#### Ponyreiten (`/angebote/ponyreiten`)
- Für Kinder (ca. 3–8 Jahre)
- Geführtes Ponyreiten
- Ponyführerschein / Pony-Kurse für Kinder
- Sicherheit und Betreuung

### Unsere Pferde (`/pferde`)
- Vorstellung der Pferde und Ponys mit Fotos und kurzen Steckbriefen
- Name, Rasse, Alter, Charakter, wofür sie eingesetzt werden

### Preise (`/preise`)
- Übersichtliche Preisliste als Tabelle oder Karten
- Einzelstunde, 5er-Karte, 10er-Karte, Monatspauschale
- Ponyreiten-Preise
- Schnupperstunde
- Hinweis: Preise können sich ändern, bitte telefonisch bestätigen

### Galerie (`/galerie`)
- Foto-Galerie mit Bildern vom Hof, den Pferden, Unterricht, Veranstaltungen
- Lightbox-Funktion zum Vergrößern
- Kategorien: Hof, Pferde, Unterricht, Events

### Kontakt (`/kontakt`)
- **Kontaktformular** mit Feldern:
  - Name
  - E-Mail
  - Telefon (optional)
  - Betreff (Dropdown: Reitunterricht, Ponyreiten, Schnupperstunde, Sonstiges)
  - Nachricht
- **Kontaktdaten:**
  - Adresse: Hafenstraße 20, 04442 Zwenkau
  - Telefon: [noch einzutragen]
  - E-Mail: [noch einzutragen]
- **Anfahrt:** Eingebettete Karte (OpenStreetMap oder Google Maps Embed)
- **Öffnungszeiten / Erreichbarkeit**

### Impressum (`/impressum`)
- Pflichtangaben nach §5 TMG
- Name, Adresse, Kontakt
- Verantwortlich für den Inhalt

### Datenschutz (`/datenschutz`)
- Datenschutzerklärung nach DSGVO
- Hinweise zu Cookies, Kontaktformular, eingebetteten Karten, etc.

---

## Design-Richtlinien

### Stil: Warm & Rustikal

Die Seite soll eine einladende, naturverbundene Atmosphäre vermitteln —
wie ein Besuch auf dem Reiterhof selbst.

### Farbpalette

| Funktion | Farbe | Hex | Beschreibung |
|---|---|---|---|
| Primär | Waldgrün | `#4A6741` | Natur, Wiesen, Vertrauen |
| Sekundär | Warmes Braun | `#8B6F47` | Holz, Sattel, Erde |
| Akzent | Sonnengelb | `#D4A843` | Wärme, Einladung, CTAs |
| Hintergrund | Cremeweiß | `#FAF7F2` | Warmer, weicher Hintergrund |
| Hintergrund Alt | Sanftes Beige | `#F0EBE1` | Abwechselnde Sektionen |
| Text | Dunkelbraun | `#3D2E1F` | Haupttext, gut lesbar |
| Text Sekundär | Warmgrau | `#6B5E50` | Untertitel, Beschreibungen |

### Typografie

- **Überschriften:** Serif-Schrift (z.B. `Playfair Display`, `Lora`, oder `Merriweather`) — warm, traditionell, vertrauenswürdig
- **Fließtext:** Sans-Serif (z.B. `Source Sans 3`, `Nunito`, oder `Open Sans`) — gut lesbar, freundlich
- **Schriftgrößen:** Großzügig, gut lesbar auch auf mobilen Geräten

### UI-Elemente

- **Buttons:** Abgerundete Ecken (`rounded-lg` bis `rounded-xl`), warme Farben
- **Karten:** Leichte Schatten, warme Ränder, eventuell mit Holz- oder Naturmuster-Akzenten
- **Bilder:** Abgerundete Ecken, vollflächig wo sinnvoll, warme Farbfilter
- **Icons:** Linienstil, passend zum rustikalen Thema (Lucide Icons empfohlen)
- **Navigation:** Klar und einfach, mobil als Hamburger-Menü
- **Footer:** Dunklerer Hintergrund (Waldgrün oder Dunkelbraun), Kontaktdaten, Links

### Responsive Design

- Mobile-First Ansatz
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Navigation: Hamburger-Menü auf mobil, volle Navigation ab `md`
- Bilder: Responsive mit `next/image`, Lazy Loading

---

## Content-Richtlinien

### Tonalität
- **Herzlich und einladend** — wie eine persönliche Einladung auf den Hof
- **Vertrauenswürdig** — Sicherheit und Kompetenz vermitteln
- **Familiär** — Du-Ansprache oder höfliches Sie (konsistent bleiben, Empfehlung: Sie)
- **Naturverbunden** — Liebe zu Pferden und Natur spürbar machen

### SEO
- Jede Seite braucht eigene `metadata` (title, description)
- Strukturierte Daten (JSON-LD) für lokales Geschäft
- Alt-Texte für alle Bilder
- Semantisches HTML (h1-h6 korrekt verschachtelt)

### Beispiel-Metatitel:
- Startseite: "Reiterhof Mandy Kolatka — Reitunterricht & Ponyreiten in Zwenkau"
- Angebote: "Reitunterricht für Anfänger & Fortgeschrittene — Reiterhof Kolatka"
- Kontakt: "Kontakt & Anfahrt — Reiterhof Mandy Kolatka, Zwenkau"

---

## Dateistruktur (Ziel)

```
src/
├── app/
│   ├── layout.tsx              # Root Layout (Navigation, Footer, Fonts)
│   ├── page.tsx                # Startseite
│   ├── ueber-uns/
│   │   └── page.tsx
│   ├── angebote/
│   │   ├── page.tsx            # Übersicht
│   │   ├── reitunterricht/
│   │   │   └── page.tsx
│   │   └── ponyreiten/
│   │       └── page.tsx
│   ├── pferde/
│   │   └── page.tsx
│   ├── preise/
│   │   └── page.tsx
│   ├── galerie/
│   │   └── page.tsx
│   ├── kontakt/
│   │   └── page.tsx
│   ├── impressum/
│   │   └── page.tsx
│   ├── datenschutz/
│   │   └── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation
│   │   ├── Footer.tsx          # Footer
│   │   └── MobileMenu.tsx      # Hamburger-Menü
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ContactForm.tsx
│   │   └── PriceCard.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ServicesOverview.tsx
│   │   ├── Testimonials.tsx
│   │   └── ContactTeaser.tsx
│   └── common/
│       ├── HorseProfile.tsx    # Pferde-Steckbrief
│       ├── Gallery.tsx         # Bildergalerie mit Lightbox
│       └── Map.tsx             # Kartenembed
├── lib/
│   └── constants.ts            # Kontaktdaten, Preise, Pferde-Daten
└── types/
    └── index.ts                # TypeScript-Typen
public/
├── images/
│   ├── hero/                   # Hero-Bilder
│   ├── horses/                 # Pferdefotos
│   ├── gallery/                # Galerie-Bilder
│   ├── team/                   # Team-Fotos
│   └── hof/                    # Bilder vom Reiterhof
├── icons/
│   └── logo.svg                # Reiterhof-Logo
└── fonts/                      # Falls lokale Schriften gewünscht
```

---

## Assets-Checkliste

### Benötigte Bilder
- [ ] **Logo** des Reiterhofs (SVG bevorzugt)
- [ ] **Hero-Bild(er):** Stimmungsvolle Aufnahmen vom Reiterhof, Pferde auf der Koppel
- [ ] **Teamfotos:** Mandy Kolatka, weitere Mitarbeiter
- [ ] **Pferdefotos:** Jedes Pferd/Pony einzeln
- [ ] **Unterrichtsfotos:** Reitunterricht in Aktion, Kinder beim Ponyreiten
- [ ] **Hoffotos:** Stallungen, Reitplatz, Koppeln, Außenanlage
- [ ] **Galerie-Bilder:** Sammlung für die Galerie-Seite

### Benötigte Informationen (noch offen)
- [ ] Telefonnummer
- [ ] E-Mail-Adresse
- [ ] Öffnungszeiten / Erreichbarkeitszeiten
- [ ] Genaue Preise für alle Angebote
- [ ] Namen und Details der Pferde/Ponys
- [ ] Text für "Über uns" / Geschichte des Hofs
- [ ] Impressum-Angaben (Steuernummer etc.)
- [ ] Datenschutz-Details (Hosting-Anbieter, Analysetools etc.)

---

## Entwicklungshinweise

### Befehle
```bash
npm run dev      # Entwicklungsserver starten
npm run build    # Statisches Build erstellen (output in /out)
npm run lint     # ESLint ausführen
```

### Wichtige Regeln
1. **Kein SSR / keine API-Routes** — Static Export Only
2. **Kontaktformular:** Muss client-seitig funktionieren (z.B. Formspree, mailto, oder ähnlicher Dienst)
3. **Bilder:** Immer `next/image` mit `width`/`height` oder `fill` verwenden
4. **Deutsche Inhalte:** Alle Texte auf Deutsch, `<html lang="de">`
5. **Barrierefreiheit:** Semantisches HTML, Alt-Texte, Tastaturnavigation, ausreichender Kontrast
6. **Performance:** Bilder optimieren (WebP bevorzugen), Lazy Loading, minimale JS-Bundles
7. **Datenschutz:** Keine externen Tracking-Scripte ohne Cookie-Banner, DSGVO-konform
