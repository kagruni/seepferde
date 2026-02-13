# Reiterhof Mandy Kolatka — Asset-Inventar

## Stil-Referenz

### Visueller Stil
- **Illustrationsstil:** Elegante, handgezeichnete Pferde-Illustrationen mit Aquarell-Charakter
- **Farbwelt:** Warme Erdtöne — Beige, Sandbraun, Salbeigrün, Cremeweiß, gedämpftes Gold
- **Stimmung:** Sophisticated, warm, naturverbunden, nicht kitschig
- **Pferde-Darstellung:** Klassische Dressurposen, anatomisch korrekt, elegant in Bewegung

### Farbpalette für Bilder
| Beschreibung | Hex-Bereich |
|---|---|
| Warmes Cremeweiß (Hintergrund) | `#FAF7F2` bis `#F5F0E8` |
| Sandbraun / Sattelbraun | `#8B6F47` bis `#A0845C` |
| Salbeigrün / Wiesengrün | `#4A6741` bis `#6B8F5E` |
| Sonnengelb / Goldton | `#D4A843` bis `#C4963A` |
| Dunkelbraun (Kontrast) | `#3D2E1F` bis `#5C4A3A` |
| Himmelblau (Akzent) | `#8FAABD` bis `#A7C4D4` |

### Umgebungs-Hinweis (gilt global)
Der Reiterhof befindet sich in einem **modernen Neubaugebiet am Zwenkauer See** —
NICHT auf einem traditionellen Bauernhof. Die Architektur ist zeitgenössisch (Flachdächer,
weiße/cremefarbene Fassaden, Holzverkleidungen), die Landschaft flach, und im Hintergrund
liegt ein See. Die Reitanlage ist in diese moderne Wohnumgebung integriert.

---

## Vorhandene Assets — Datei-Zuordnung

Alle aktuellen Dateien liegen in `public/` mit nummeriertem Schema.
Beim Einbau in die Website sollten sie in die Zielstruktur kopiert/umbenannt werden.

### 1. Logo & Branding

| Quelldatei | Zieldatei | Beschreibung |
|---|---|---|
| `1.1.svg` | `public/icons/logo.svg` | SVG-Logo: Linienart-Pferd + "REITERHOF MANDY KOLATKA", braun (#6c4016) |
| `1.1.jpeg` | `public/icons/logo.jpeg` | JPEG-Version des Logos (für Social Media, OG-Tags etc.) |

**Favicon:** Aus dem SVG-Logo ableitbar (Pferdekopf-Ausschnitt oder vereinfachte Silhouette).

### 2. Hero-Bilder (Startseite)

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `2.1.jpeg` | `public/images/hero/hero-main.webp` | Panorama: Modernes Wohngebiet, Reitplatz, 2 Pferde, See im Hintergrund, Golden Hour | Haupt-Hero auf Startseite |
| `2.2.jpeg` | `public/images/hero/hero-rider.webp` | Reiterin auf Fuchs im Schritt/Trab, Holzzaun, moderne Gebäude + See im Hintergrund | Hero-Variante / Angebote-Header |

### 3. Angebotsseiten-Bilder

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `3.1.jpeg` | `public/images/angebote/ponyreiten-1.webp` | Kind auf Shetland-Pony, Frau führt, moderne Stallgebäude im Hintergrund | **Ponyreiten** Hauptbild |
| `3.2.jpeg` | `public/images/angebote/reitunterricht-anfaenger.webp` | Anfängerin auf Warmblut, Reitlehrerin daneben, Reitplatz mit Holzzaun | **Reitunterricht Anfänger** |
| `3.3.jpeg` | `public/images/angebote/ponyreiten-2.webp` | Kind auf Pony, ländlicher Weg mit Wildblumen, weitere Ponys im Hintergrund | **Ponyreiten** Ergänzung / Galerie |
| `3.4.jpeg` | `public/images/angebote/longenstunde.webp` | Longenstunde: Reiterin mit ausgestreckten Armen auf Schimmel, Reitlehrerin mit Longe | **Longenstunde** |
| `3.5.jpeg` | `public/images/angebote/schnupperstunde.webp` | Junge Frau streichelt Pferd am Stall, erste Begegnung, warme Atmosphäre | **Schnupperstunde** |

### 4. Pferde-Portraits

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `4.1.jpeg` | `public/images/horses/warmblut-fuchs.webp` | Fuchs-Portrait, weißer Stern auf Stirn, warmes Bokeh, goldenes Licht | Pferde-Steckbrief |
| `4.2.jpeg` | `public/images/horses/warmblut-rappe.webp` | Rappe-Portrait, glänzendes schwarzes Fell, edles Profil, warmes Gegenlicht | Pferde-Steckbrief |

### 7. Dekorative Elemente

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `7.1.jpeg` | `public/images/decorative/watercolor-horse.webp` | Aquarell-Illustration: Pferd im Trab, Seitenprofil, Erdtöne, weißer Hintergrund | Dekoelement Sektionen, Über-uns |
| `7.2.jpeg` | `public/images/decorative/watercolor-hufeisen.webp` | Aquarell-Hufeisen mit Blumen & Blättern, Gold-Braun-Töne *(hat "Riding Farm" Text unten)* | Dekoelement, ggf. Text entfernen |
| `7.3.jpeg` | `public/images/decorative/divider-botanical.webp` | Botanische Trennlinie: Blumen, Weizen, Blätter in warmem Braun | Sektions-Trenner |
| `7.3.svg` | `public/images/decorative/divider-botanical.svg` | SVG-Version der botanischen Trennlinie | Sektions-Trenner (bevorzugt) |

### 8. Kontaktseite

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `8.1.jpeg` | `public/images/kontakt/eingang.webp` | Moderner Eingang mit "Reiterhof"-Schild, Pferd am Zaun, See im Hintergrund | Kontaktseite Header |

### 9. Texturen

| Quelldatei | Zieldatei | Beschreibung | Verwendung |
|---|---|---|---|
| `9.1.jpeg` | `public/images/textures/wood-light.webp` | Helle Holzmaserung (Birke/Eiche), warme Beigetöne | Karten-Hintergrund, UI-Akzente |
| `9.2.jpeg` | `public/images/textures/paper-warm.webp` | Warme Creme-Papierstruktur, subtile Fasern | Sektions-Hintergrund-Overlay |

---

## Nicht generierte Assets (bewusst ausgelassen)

Die folgenden Kategorien wurden als nicht essentiell eingestuft und können
später mit **echten Fotos** ergänzt werden:

### Zusätzliche Pferde-Portraits (4.3–4.6)
- Schimmel, Shetland-Pony, Haflinger, Deutsches Reitpony
- **Empfehlung:** Echte Fotos der tatsächlichen Pferde verwenden, sobald verfügbar

### Hof & Anlagen (Sektion 5)
- Stallgebäude, Reitplatz, Koppel, Putzplatz
- **Empfehlung:** Echte Fotos vom Standort verwenden — die Realität (modernes Neubaugebiet am See) ist einzigartig und eindrucksvoller als jedes generierte Bild

### Galerie-Bilder (Sektion 6)
- Gruppenunterricht, Vertrauensmoment, Sattelkammer, Herbststimmung
- **Empfehlung:** Über die Zeit echte Fotos aus dem Alltag sammeln

### Hero-Variante Kinder (2.3)
- Zwei Hero-Bilder sind ausreichend für den Launch

---

## Hinweise für die Entwicklung

### Bildverarbeitung beim Einbau
1. **Format konvertieren:** Alle JPEG-Dateien → WebP (Qualität 80–85%)
2. **Verzeichnisstruktur anlegen:** Dateien in Zielstruktur verschieben/umbenennen
3. **Favicon generieren:** Aus `1.1.svg` ableiten (Pferdekopf-Ausschnitt)
4. **OG-Image erstellen:** `2.1.jpeg` als Basis für Social-Media-Preview

### next/image Konfiguration
Da Static Export (`output: "export"`) genutzt wird, muss `next/image` mit
`unoptimized: true` in `next.config.ts` konfiguriert werden, ODER die Bilder
werden vorab in WebP konvertiert und mit festen `width`/`height`-Werten eingebunden.

### Konsistenz-Regeln
- Alle Fotos haben eine **einheitliche warme Farbtemperatur**
- Natürliches Licht (Golden Hour / weiches Tageslicht)
- Bei Menschen: Gesichter teilverdeckt (Reithelm, seitlich, von hinten)
- Pferde: anatomisch korrekt
- Architektur: **Modern** — weiße/cremefarbene Gebäude, Flachdächer, Holzverkleidung
- Zäune: Natürliche **Holz-Pfosten-und-Riegel-Zäune** (post-and-rail)
- Setting: Modernes Wohngebiet mit integrierter Reitanlage am Zwenkauer See

### Anmerkung zu 7.2 (Hufeisen)
Das Aquarell-Hufeisen enthält den Text "RIDING FARM" am unteren Rand.
Dieser sollte entweder per Bildbearbeitung entfernt oder beim Einbau so
beschnitten werden, dass der Text nicht sichtbar ist.
