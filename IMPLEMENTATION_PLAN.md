# Reiterhof Mandy Kolatka — Implementierungsplan

> Dieses Dokument ist die vollständige Schritt-für-Schritt-Anleitung für die
> Umsetzung der Website in einer Claude Code Session. Es referenziert CLAUDE.md
> (Projektübersicht) und ASSETS.md (Asset-Inventar) für Details.

---

## Phase 0 — Projektsetup & Konfiguration

### 0.1 Abhängigkeiten installieren
```bash
npm install lucide-react
```
Keine weiteren externen Abhängigkeiten nötig. Fonts kommen über `next/font/google`.

### 0.2 next.config.ts anpassen
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```
**Wichtig:** `images.unoptimized: true` ist Pflicht für Static Export.

### 0.3 Assets organisieren
Die aktuellen Quelldateien (`1.1.jpeg`, `2.1.jpeg` etc.) in `public/` müssen in
die Zielstruktur verschoben werden. Siehe vollständige Zuordnung in ASSETS.md.

Verzeichnisse anlegen:
```
public/
├── images/
│   ├── hero/
│   ├── angebote/
│   ├── horses/
│   ├── decorative/
│   ├── kontakt/
│   └── textures/
├── icons/
└── fonts/
```

Dateien umbenennen und verschieben gemäß ASSETS.md Datei-Zuordnung.
Die Default-Next.js-Dateien (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
können entfernt werden.

### 0.4 Fonts konfigurieren
In `layout.tsx` die Geist-Fonts ersetzen durch:

- **Überschriften:** `Lora` (Serif, Google Font) — warm, elegant, leicht traditionell
- **Fließtext:** `Source Sans 3` (Sans-Serif, Google Font) — klar, freundlich, gut lesbar

```tsx
import { Lora, Source_Sans_3 } from "next/font/google";

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});
```

`<html lang="de">` nicht vergessen — die Seite ist Deutsch.

---

## Phase 1 — Design-System & Globale Styles

### 1.1 globals.css — Farbpalette & CSS Custom Properties

Das gesamte Farbsystem über CSS Custom Properties definieren.
Tailwind v4 nutzt `@theme` Direktiven in CSS:

```css
@import "tailwindcss";

@theme {
  --color-forest: #4A6741;
  --color-forest-dark: #3A5233;
  --color-forest-light: #5A7A51;

  --color-brown: #8B6F47;
  --color-brown-dark: #6C5636;
  --color-brown-light: #A0845C;

  --color-gold: #D4A843;
  --color-gold-dark: #C4963A;
  --color-gold-light: #E0BD6A;

  --color-cream: #FAF7F2;
  --color-beige: #F0EBE1;
  --color-beige-dark: #E5DED0;

  --color-text: #3D2E1F;
  --color-text-secondary: #6B5E50;
  --color-text-light: #8A7D6F;

  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}
```

### 1.2 Globale Typografie-Regeln

```css
body {
  font-family: var(--font-body), system-ui, sans-serif;
  color: var(--color-text);
  background-color: var(--color-cream);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), Georgia, serif;
  color: var(--color-text);
  font-weight: 600;
}
```

### 1.3 Typografie-Skala

| Element | Desktop | Mobil | Font | Gewicht |
|---|---|---|---|---|
| h1 (Hero) | 3.5rem / 56px | 2.25rem / 36px | Lora | 700 |
| h2 (Sektionen) | 2.5rem / 40px | 1.75rem / 28px | Lora | 600 |
| h3 (Karten) | 1.5rem / 24px | 1.25rem / 20px | Lora | 600 |
| h4 (Unter-Überschrift) | 1.25rem / 20px | 1.125rem / 18px | Lora | 600 |
| Body | 1.125rem / 18px | 1rem / 16px | Source Sans 3 | 400 |
| Body small | 0.875rem / 14px | 0.875rem / 14px | Source Sans 3 | 400 |
| Button | 1rem / 16px | 1rem / 16px | Source Sans 3 | 600 |

---

## Phase 1.5 — Design Language: "Aquarell-Rustikal"

> **KRITISCH:** Diese Sektion definiert den visuellen Charakter der gesamten Website.
> Sie ist die wichtigste Referenz für alle Design-Entscheidungen.

### Kern-Konzept

Die Website kombiniert zwei Welten:
1. **Moderner, sauberer Standort** (zeitgenössische Architektur am Zwenkauer See)
2. **Warme, handgemachte Ästhetik** (Aquarell-Illustrationen, Erdtöne, botanische Akzente)

Das Ergebnis: Eine Seite, die **modern und aufgeräumt** wirkt, aber durch
**warme Texturen, handgezeichnete Elemente und Naturfarben** eine
emotionale, einladende Tiefe bekommt.

### Aquarell-Designelemente — Wo und Wie

#### Botanischer Trenner zwischen Sektionen
- Asset: `7.3.svg` (botanische Trennlinie mit Blumen, Weizen, Blättern)
- Verwendung: Zwischen allen Hauptsektionen auf der Startseite und ggf. auf Unterseiten
- Umsetzung: `<img>` Tag, zentriert, Breite ~60% des Containers, `opacity-60`
- Nicht übertreiben: 2–3 Mal pro Seite maximal, nicht zwischen JEDEM Absatz

#### Aquarell-Pferd als Deko-Element
- Asset: `7.1.jpeg` (Aquarell-Pferd im Trab)
- Verwendung: Auf der "Über uns"-Seite als Deko neben dem Text, oder
  als subtiles Hintergrund-Element (stark transparent, `opacity-10` bis `opacity-15`)
- Auf der Startseite ggf. in der Willkommens-Sektion als Akzent
- NICHT als Hauptbild verwenden — nur als dekorative Ergänzung

#### Aquarell-Hufeisen
- Asset: `7.2.jpeg` (Hufeisen mit Blumen)
- Verwendung: Auf der Kontaktseite oder als "Glücks"-Symbol bei Call-to-Actions
- **Achtung:** Hat "RIDING FARM" Text am unteren Rand → beim Einbau unten abschneiden
  (CSS `object-fit: cover` mit `object-position: top`)

#### Papier-Textur als Hintergrund
- Asset: `9.2.jpeg` (warme Creme-Papierstruktur)
- Verwendung: Als subtiler Hintergrund für abwechselnde Sektionen
- Umsetzung: `background-image` mit `opacity-30` bis `opacity-50` als Overlay
- Verleiht dem digitalen Hintergrund eine "handgemachte" Wärme
- Nur auf ausgewählten Sektionen, nicht global

#### Holz-Textur
- Asset: `9.1.jpeg` (helle Holzmaserung)
- Verwendung: Optional als Hintergrund für Karten (z.B. Preiskarten) oder
  den Footer-Bereich als dezenter Akzent
- Sparsam einsetzen — maximal 1–2 Stellen

### UI-Komponenten im Aquarell-Stil

#### Buttons
```
Primär (CTA):      bg-gold, text-white, rounded-xl, hover→bg-gold-dark
                    Schatten: shadow-md mit warmem Braun-Ton
                    Border: Keinen oder 1px gold-dark

Sekundär:           bg-transparent, border-2 border-brown, text-brown
                    rounded-xl, hover→bg-brown hover→text-white

Ghost/Tertiär:      text-forest, underline-offset-4, hover→text-forest-dark
                    Kein Border, kein Hintergrund
```
- Alle Buttons haben `transition-all duration-300` für sanfte Übergänge
- Padding: `px-8 py-3` (Desktop), `px-6 py-2.5` (Mobil)
- Font: Source Sans 3, semibold, leicht geletterspaced (`tracking-wide`)

#### Karten
```
Standard-Karte:     bg-white, rounded-2xl, shadow-sm
                    border: 1px solid rgba(139,111,71,0.12)  (subtiles Braun)
                    hover: shadow-md, translateY(-2px)
                    overflow-hidden für Bilder mit abgerundeten Ecken

Bild oben:          Bild füllt obere Hälfte, rounded-t-2xl
                    Padding unten: p-6

Preis-Karte:        Wie Standard, aber mit gold Header-Streifen (h-1 bg-gold oben)
                    Oder: bg-beige statt bg-white für Wärme
```

#### Bilder
- Alle Bilder: `rounded-xl` oder `rounded-2xl`
- Hero-Bilder: Volle Breite, kein Rounding, dafür ein `overlay-gradient` darüber
  (von transparent nach rgba(250,247,242,0.3) am unteren Rand) für weichen Übergang
- Angebots-Bilder: `object-cover`, feste Höhe (300px Desktop, 200px Mobil)
- Pferde-Portraits: Quadratisch oder leicht vertikal, `rounded-full` oder `rounded-2xl`
  in einer Karte

#### Sektionen — Wechselnde Hintergründe
```
Sektion 1 (Hero):         bg-cream (Standard)
--- botanischer Trenner ---
Sektion 2 (Willkommen):   bg-white + Papier-Textur-Overlay
--- botanischer Trenner ---
Sektion 3 (Angebote):     bg-beige
--- botanischer Trenner ---
Sektion 4 (Kontakt-CTA):  bg-forest, text-white (dunkle Sektion als Kontrast)
Footer:                    bg-text (dunkelbraun #3D2E1F), text-cream
```

#### Navigation
```
Desktop:    Sticky top, bg-cream/90 backdrop-blur-md
            Logo links, Nav-Links mittig oder rechts
            Links: text-text, hover→text-forest, active→text-forest + font-semibold
            CTA-Button rechts: "Schnupperstunde" in gold-Variante (klein)
            Höhe: h-20 (80px)
            Unterer Rand: 1px solid rgba(139,111,71,0.1) für subtile Trennung

Mobil:      Hamburger-Menü rechts
            Fullscreen Overlay mit bg-cream
            Links zentriert, große Schrift (text-2xl, font-heading)
            CTA-Button unten im Menü
```

#### Footer
```
bg-[#3D2E1F] (dunkelbraun), text-cream
Drei Spalten (Desktop): Kontakt | Navigation | Öffnungszeiten
Logo oben, zentriert oder links
Botanischer Trenner (7.3) in Weiß/Cream über dem Footer als Übergang
Aquarell-Hufeisen (7.2) als dekoratives Element (klein, opacity-30, absolut positioniert)
Copyright-Zeile ganz unten, text-text-light, text-sm
```

### Animations- & Interaktions-Prinzipien

- **Scroll-Animationen:** Sanftes Fade-in von unten (`opacity-0 → opacity-100`,
  `translateY(20px) → translateY(0)`) wenn Elemente in den Viewport kommen.
  Umsetzung: Intersection Observer + CSS Transitions. KEIN schwerer
  Animations-Library wie Framer Motion — halten wir leicht.
- **Hover-Effekte:** Subtil — Karten heben sich leicht an (`translateY(-2px)`),
  Bilder bekommen leichten Zoom (`scale(1.02)`), Links ändern Farbe.
  Alles mit `transition-all duration-300 ease-out`.
- **Seitenwechsel:** Keine — Static Export unterstützt keine Page Transitions.
- **Ladezeit:** Keine Ladeanimationen — die Seite ist statisch und lädt sofort.

---

## Phase 2 — Layout-Komponenten

### 2.1 src/components/layout/Header.tsx
- Sticky Navigation mit Logo + Links
- Desktop: Logo links, Links rechts, "Schnupperstunde"-CTA ganz rechts
- Mobil: Logo links, Hamburger rechts
- Links: Startseite, Über uns, Angebote, Pferde, Preise, Galerie, Kontakt
- State: `scrolled` (Boolean) — bei Scroll bg-opacity erhöhen + shadow-sm hinzufügen
- Logo: `1.1.svg` → als `<Image>` Tag, Höhe ~50px

### 2.2 src/components/layout/MobileMenu.tsx
- `"use client"` Komponente
- Fullscreen Overlay (fixed, inset-0, z-50)
- Sanfte Open/Close Animation (opacity + translateX)
- Links schließen das Menü
- Fokus-Trap für Accessibility

### 2.3 src/components/layout/Footer.tsx
- Dunkelbraun-Hintergrund (#3D2E1F)
- 3-Spalten-Layout (Desktop), 1-Spalte-Stack (Mobil)
- Spalte 1: Logo + kurze Beschreibung + Social-Links-Platzhalter
- Spalte 2: Navigation-Links (gleiche wie Header)
- Spalte 3: Kontaktdaten (Adresse, Telefon-Platzhalter, E-Mail-Platzhalter)
- Copyright-Zeile unten
- Botanischer Trenner (7.3) als `border-image` oder separates Element über dem Footer

### 2.4 src/app/layout.tsx aktualisieren
- Fonts einbinden (Lora + Source Sans 3)
- `<html lang="de">` setzen
- Header und Footer einbinden
- Default metadata setzen

---

## Phase 3 — Shared Components

### 3.1 src/components/ui/Button.tsx
Props: `variant` (primary | secondary | ghost), `size` (sm | md | lg), `href?`, `children`
Wenn `href` gesetzt → `<Link>`, sonst `<button>`

### 3.2 src/components/ui/Card.tsx
Props: `imageSrc?`, `imageAlt?`, `title`, `description`, `href?`, `children?`
Bild oben, Text unten, optional klickbar als Link

### 3.3 src/components/ui/SectionDivider.tsx
Zeigt den botanischen Trenner (`7.3.svg`), zentriert, mit optionaler Breite

### 3.4 src/components/ui/ContactForm.tsx
`"use client"` Komponente
Felder: Name, E-Mail, Telefon (optional), Betreff (Dropdown), Nachricht
Action: `mailto:` Link oder Formspree Endpoint (konfigurierbar über constants.ts)
Validierung: Client-seitig, einfach (required-Felder prüfen)
Erfolgsmeldung nach Absenden

### 3.5 src/components/ui/PriceCard.tsx
Props: `title`, `price`, `unit` (z.B. "pro Stunde"), `features[]`, `highlighted?`
Gold-Akzent-Streifen oben wenn `highlighted`

### 3.6 src/components/common/HorseProfile.tsx
Props: `name`, `breed`, `age?`, `character`, `role`, `imageSrc`
Karten-Layout: Bild (quadratisch, rounded-2xl) + Steckbrief-Text

### 3.7 src/components/common/Map.tsx
OpenStreetMap Embed (iframe) für Hafenstraße 20, 04442 Zwenkau
Responsive, rounded-xl, mit Schatten

### 3.8 src/components/sections/Hero.tsx
Props: `imageSrc`, `title`, `subtitle`, `ctaText`, `ctaHref`
Vollbreites Bild, Overlay-Gradient, Text + CTA zentriert

### 3.9 src/components/sections/ServicesOverview.tsx
3-Spalten-Grid (Desktop) mit Karten: Reitunterricht, Ponyreiten, Schnupperstunde
Jede Karte: Bild + Titel + Kurztext + "Mehr erfahren" Link

### 3.10 src/components/sections/ContactTeaser.tsx
Dunkle Sektion (bg-forest, text-white)
Adresse, Telefon-Platzhalter, CTA "Kontakt aufnehmen"

### 3.11 src/lib/constants.ts
Zentrale Datei für alle Daten:
```ts
export const CONTACT = {
  address: "Hafenstraße 20, 04442 Zwenkau",
  phone: "[wird ergänzt]",
  email: "[wird ergänzt]",
  hours: "[wird ergänzt]",
};

export const PRICES = { ... };
export const HORSES = [ ... ];
export const NAV_LINKS = [ ... ];
```

### 3.12 src/types/index.ts
TypeScript-Typen für Horse, Price, NavLink, etc.

---

## Phase 4 — Seiten implementieren

### 4.1 Startseite (`src/app/page.tsx`) — HÖCHSTE PRIORITÄT

Die Startseite ist das Aushängeschild. Aufbau von oben nach unten:

1. **Hero** — `2.1.jpeg` (Hero Main), volle Breite
   - Overlay: linearer Gradient von unten (cream → transparent)
   - Zentrierter Text: "Willkommen auf dem Reiterhof Mandy Kolatka" (h1, Lora, weiß)
   - Untertitel: "Reitunterricht & Ponyreiten am Zwenkauer See" (Source Sans, weiß/cream)
   - CTA-Button: "Schnupperstunde vereinbaren" (gold)
   - Höhe: 80vh (Desktop), 60vh (Mobil)

2. **Botanischer Trenner**

3. **Willkommen / Über uns Teaser** — bg-white + Papier-Textur
   - 2 Spalten (Desktop): Text links, Aquarell-Pferd (7.1) rechts als Deko
   - Kurzer Willkommenstext (3–4 Sätze)
   - "Mehr über uns erfahren" Link

4. **Botanischer Trenner**

5. **Unsere Angebote** — bg-beige
   - Überschrift: "Unsere Angebote" (h2)
   - 3 Karten im Grid:
     - Reitunterricht (Bild: 3.2) → Link: /angebote/reitunterricht
     - Ponyreiten (Bild: 3.1) → Link: /angebote/ponyreiten
     - Schnupperstunde (Bild: 3.5) → Link: /kontakt
   - Unter den Karten: "Alle Angebote ansehen" Link

6. **Botanischer Trenner**

7. **Kontakt-Teaser** — bg-forest, text-white
   - "Besuchen Sie uns" (h2)
   - Adresse + Platzhalter für Telefon/E-Mail
   - CTA: "Kontakt aufnehmen" (gold-Button)
   - Optional: Aquarell-Hufeisen (7.2) als Deko-Element (opacity-20, absolut positioniert)

8. **Footer**

### 4.2 Über uns (`src/app/ueber-uns/page.tsx`)

- Header-Bild: `2.2.jpeg` (Hero Rider) — kleinere Variante (h-[400px])
- Philosophie-Sektion mit Aquarell-Pferd (7.1) als Deko
- Platzhalter für Team-Vorstellung (Mandy Kolatka — noch kein Foto)
- Text: Platzhalter-Content, der die Tonalität (warm, einladend, Sie-Form) demonstriert

### 4.3 Angebote Übersicht (`src/app/angebote/page.tsx`)

- Kurze Einleitung
- Grid mit allen Angeboten als Karten (Reitunterricht, Ponyreiten, Longenstunde, Schnupperstunde)
- Jede Karte verlinkt auf die jeweilige Detailseite

### 4.4 Reitunterricht (`src/app/angebote/reitunterricht/page.tsx`)

- Header-Bild: `3.2.jpeg` (Anfängerin im Unterricht)
- Abschnitte: Anfänger, Fortgeschrittene, Einzelunterricht, Gruppenunterricht
- Bild: `3.4.jpeg` (Longenstunde) im Longe-Abschnitt
- CTA: "Jetzt Schnupperstunde vereinbaren"

### 4.5 Ponyreiten (`src/app/angebote/ponyreiten/page.tsx`)

- Header-Bild: `3.1.jpeg` (Kind auf Pony)
- Beschreibung: Alter, Sicherheit, Ablauf
- Zweites Bild: `3.3.jpeg` (Pony auf Weg)
- CTA: "Termin für Ponyreiten vereinbaren"

### 4.6 Unsere Pferde (`src/app/pferde/page.tsx`)

- Einleitungstext
- Grid mit Pferde-Steckbriefen (HorseProfile-Komponente)
- Aktuell 2 Pferde-Portraits (4.1 Fuchs, 4.2 Rappe)
- Platzhalter-Daten (Name, Rasse, Charakter — wird später mit echten Daten gefüllt)
- Layout: 2–3 Spalten Grid, Karten mit Bild + Steckbrief

### 4.7 Preise (`src/app/preise/page.tsx`)

- Übersichtliche Darstellung als PriceCard-Grid
- Kategorien: Reitunterricht, Ponyreiten, Schnupperstunde, Paket-Angebote
- Platzhalter-Preise (werden später mit echten Preisen gefüllt)
- Hinweis: "Alle Preise unter Vorbehalt. Bitte kontaktieren Sie uns für aktuelle Informationen."
- CTA unten: "Jetzt Schnupperstunde buchen"

### 4.8 Galerie (`src/app/galerie/page.tsx`)

- Masonry-Grid oder einfaches responsives Grid
- Alle verfügbaren Bilder (Hero-Varianten, Angebots-Bilder, Pferde-Portraits)
- Lightbox-Funktion: Einfache `"use client"` Komponente mit Modal
  (kein externer Library nötig — `<dialog>` Element + CSS)
- Kategorien als Filter-Buttons oben (optional für Launch)

### 4.9 Kontakt (`src/app/kontakt/page.tsx`)

- Header-Bild: `8.1.jpeg` (Eingang zum Reiterhof)
- 2-Spalten-Layout (Desktop):
  - Links: Kontaktformular (ContactForm-Komponente)
  - Rechts: Kontaktdaten + OpenStreetMap Embed
- Kontaktformular-Action: `mailto:` als Fallback, Formspree empfohlen
- Öffnungszeiten: Platzhalter

### 4.10 Impressum (`src/app/impressum/page.tsx`)

- Einfache Text-Seite
- Pflichtangaben nach §5 TMG
- Platzhalter für: Name, Adresse, Telefon, E-Mail, Steuernummer
- Minimales Styling (prose-artig)

### 4.11 Datenschutz (`src/app/datenschutz/page.tsx`)

- Umfassende DSGVO-Datenschutzerklärung
- Abschnitte: Verantwortlicher, Hosting, Kontaktformular, Cookies,
  eingebettete Inhalte (OpenStreetMap), Betroffenenrechte
- Standard-DSGVO-Bausteine für eine statische Website ohne Tracking
- Platzhalter für spezifische Details (Hosting-Anbieter etc.)

---

## Phase 5 — SEO & Meta

### 5.1 Metadata pro Seite

Jede `page.tsx` exportiert eigene Metadata:

```ts
export const metadata: Metadata = {
  title: "Seitentitel — Reiterhof Mandy Kolatka",
  description: "Beschreibung...",
};
```

Titel-Beispiele (siehe CLAUDE.md für vollständige Liste):
- `/` → "Reiterhof Mandy Kolatka — Reitunterricht & Ponyreiten in Zwenkau"
- `/angebote/reitunterricht` → "Reitunterricht für Anfänger & Fortgeschrittene — Reiterhof Kolatka"
- `/kontakt` → "Kontakt & Anfahrt — Reiterhof Mandy Kolatka, Zwenkau"

### 5.2 JSON-LD Structured Data

In `layout.tsx` oder Startseite: LocalBusiness Schema einfügen:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Reiterhof Mandy Kolatka",
  "description": "Familiärer Reiterhof mit Reitunterricht und Ponyreiten in Zwenkau bei Leipzig",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hafenstraße 20",
    "addressLocality": "Zwenkau",
    "postalCode": "04442",
    "addressCountry": "DE"
  },
  "url": "https://mandykolatka.kajik.dev"
}
```

### 5.3 OG-Image & Favicon

- OG-Image: `2.1.jpeg` (Hero-Bild) in der Root-Metadata referenzieren
- Favicon: Aus `1.1.svg` ableiten — vereinfachtes Pferdekopf-Icon

---

## Phase 6 — Abschluss & Qualität

### 6.1 Build & Test
```bash
npm run build    # Static Export → /out Verzeichnis
npm run lint     # ESLint Fehler beheben
```

### 6.2 Checkliste vor Launch

- [ ] Alle Seiten rendern ohne Fehler
- [ ] `<html lang="de">` gesetzt
- [ ] Responsive: Mobil, Tablet, Desktop getestet
- [ ] Navigation funktioniert (Desktop + Hamburger-Menü)
- [ ] Alle Bilder haben Alt-Texte (deutsch)
- [ ] Kontaktformular funktioniert (zumindest mailto-Fallback)
- [ ] Karte auf Kontaktseite zeigt korrekte Position
- [ ] Impressum und Datenschutz vorhanden
- [ ] Keine externen Tracking-Scripte (DSGVO)
- [ ] Favicon sichtbar
- [ ] Meta-Titel und -Beschreibungen auf allen Seiten
- [ ] Build erfolgreich (`npm run build` ohne Fehler)
- [ ] Alle Platzhalter-Texte sind klar als Platzhalter erkennbar (z.B. "[wird ergänzt]")

---

## Implementierungs-Reihenfolge (empfohlen)

Für die Claude Code Session empfehle ich diese Reihenfolge:

1. **Phase 0:** Config, Assets organisieren, Fonts
2. **Phase 1:** globals.css, Farbpalette, Typografie
3. **Phase 2:** Layout (Header → Footer → MobileMenu → layout.tsx)
4. **Phase 3:** Basis-Komponenten (Button, Card, SectionDivider, Hero)
5. **Phase 4.1:** Startseite (das Herzstück — hier wird alles zusammengeführt)
6. **Build & Test** (erste Qualitätsprüfung)
7. **Phase 4.2–4.5:** Über uns, Angebote, Reitunterricht, Ponyreiten
8. **Phase 4.6–4.8:** Pferde, Preise, Galerie
9. **Phase 4.9–4.11:** Kontakt, Impressum, Datenschutz
10. **Phase 5:** SEO & Meta (kann parallel zu den Seiten eingebaut werden)
11. **Phase 6:** Finaler Build, Checkliste, Feinkorrekturen

---

## Offene Punkte / Platzhalter

Diese Informationen fehlen noch und werden als Platzhalter eingebaut:

| Information | Platzhalter | Wo benötigt |
|---|---|---|
| Telefonnummer | `[wird ergänzt]` | Kontakt, Footer, Header-CTA |
| E-Mail-Adresse | `[wird ergänzt]` | Kontakt, Footer, Formular-Action |
| Öffnungszeiten | `[wird ergänzt]` | Kontakt, Footer |
| Preise (alle) | Platzhalter-Werte | Preise-Seite |
| Pferde-Namen & Details | Platzhalter-Daten | Pferde-Seite |
| "Über uns" Text | Platzhalter-Text | Über-uns-Seite |
| Impressum-Angaben | Platzhalter | Impressum |
| Datenschutz-Details | Standard-Bausteine | Datenschutz |
| Formular-Endpoint | `mailto:` Fallback | Kontaktformular |
