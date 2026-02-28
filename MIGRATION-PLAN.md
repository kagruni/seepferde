# Migrationsplan: Kursangebote ersetzen

## Ausgangslage

Die Website ist aktuell als klassischer Reiterhof aufgebaut mit folgenden Angeboten:

- **Reitunterricht** (Anfänger / Fortgeschrittene / Einzel / Gruppe)
- **Ponyreiten** (Geführtes Reiten für Kinder ab 3 Jahren)
- **Longenstunden** (Anfänger an der Longe)
- **Schnupperstunde** (Einmalige Probestunde)

Diese werden komplett ersetzt durch **5 neue Angebote** in zwei Kategorien.

---

## Neue Angebote (aus PDF)

### Kategorie: Seminare (Pferdegestütztes Coaching)

#### 1. Coaching für Führungskräfte
- **Typ:** Seminar
- **Kern:** Pferdegestütztes Leadership-Coaching — Pferde als Spiegel für Führungsverhalten
- **Themen:** Führungsstile erkennen, Authentizität stärken, Durchsetzungsfähigkeit, Veränderungsprozesse begleiten, eigene Rolle einordnen, Stärken/Schwächen erkennen
- **Teilnehmer:** Unternehmer, Manager, Abteilungs-/Team-/Projektleiter, Personalverantwortliche, Nachwuchskräfte mit Führungsaufgaben
- **Format:** Einzel- und Gruppencoaching, auch für Unternehmen
- **Besonderheit:** Keine Reiterfahrung nötig (Arbeit *mit* dem Pferd, nicht *auf* dem Pferd)

#### 2. Teambuilding
- **Typ:** Seminar
- **Kern:** Pferdegestütztes Teambuilding — Pferd als neues Teammitglied, Teamdynamik erkennen
- **Themen:** Kommunikation im Team, Motivation, Veränderungsprozesse, Teamgefühl stärken, Aufgabenverteilung, Miteinander statt Gegeneinander, Hierarchien erkennen
- **Teilnehmer:** Unternehmer, Manager, Abteilungs-/Team-/Projektleiter, Personalverantwortliche, Mitarbeiter, Nachwuchskräfte
- **Format:** Einzel- und Gruppencoaching, auch für Unternehmen
- **Besonderheit:** Keine Reiterfahrung nötig

#### 3. Raus aus dem Alltag – rein ins Erleben!
- **Typ:** Erlebnistag / Team-Event
- **Kern:** Kreativer, erlebnisorientierter Tag — Teamgeist stärken durch gemeinsames Erleben
- **Teilnehmer:** Firmen, Vereine, Familien, Freundeskreise
- **Extras:** Volle Verpflegung und Organisation möglich (Catering, Lagerfeuer, Fotograf)
- **Besonderheit:** Keine Reiterfahrung nötig

### Kategorie: Workshops (Reiten & Training)

#### 4. Extreme-Trail
- **Typ:** Workshop
- **Kern:** Erster Extreme-Trail Park in Sachsen! Vertrauen aufbauen, Eigenständigkeit für Mensch und Pferd
- **Beschreibung:** Hindernisse aus natürlichen Materialien (Gräben, Brücken, Baumstämme, Felsen). Pferde lernen Mut und bauen Vertrauen auf. Artgerechte Beschäftigung, ideale Geländevorbereitung.
- **Teilnehmer:** Alle Rassen, alle Reitweisen, Anfänger bis Fortgeschrittene
- **Teilnehmerzahl:** 4–8 aktive Teilnehmer + 10 Zuschauerplätze
- **Besonderheit:** Teilnahme mit eigenem Pferd oder mit einem Pferd vom Hof möglich

#### 5. Working-Equitation
- **Typ:** Workshop
- **Kern:** Motivations-Parcours für Pferd und Reiter — dressurmäßige Arbeit verbunden mit konkreten Trail-Aufgaben
- **Parcours-Elemente:** Stier zum Ringstechen, Parallelslalom, Brücke, Tonnen, Glockengasse, Pferch, Tor, Sprung
- **Teilnehmer:** Einsteiger bis Fortgeschrittene, Pferde aller Rassen
- **Teilnehmerzahl:** 4–6 aktive Teilnehmer + 10 Zuschauer

#### 6. Garrocha
- **Typ:** Workshop
- **Kern:** Einstieg in das Reiten mit der Garrocha — traditionelle südeuropäische Reitkunst als Motivation und Freude
- **Beschreibung:** Gibt Lektionen mehr Sinn, verbessert Sitz und Linienführung, schult Fokus, macht beweglicher im Sattel
- **Voraussetzungen:** Sicheres Reiten im Schritt und Trab, enge Volten (~6m), Vorhand/Hinterhand verschieben, Grundlagen einhändiges Reiten

---

## Betroffene Dateien

### Zu ändern

| Datei | Was ändern |
|---|---|
| `src/lib/constants.ts` | `ANGEBOTE`-Array komplett ersetzen (6 neue Einträge). `PRICES`-Array anpassen oder entfernen (keine Preise im PDF). |
| `src/app/page.tsx` | Homepage-Sektion "Unsere Angebote" aktualisieren — neue Angebote zeigen, evtl. in 2 Kategorien (Seminare / Workshops) aufteilen |
| `src/app/angebote/page.tsx` | Übersichtsseite komplett neu aufbauen — zwei Bereiche: Seminare und Workshops |
| `src/app/preise/page.tsx` | Preisstruktur anpassen — alte Kategorien entfernen, neue einfügen (Preise bleiben Platzhalter) |
| `src/app/kontakt/page.tsx` | Betreff-Dropdown im Kontaktformular aktualisieren (alte Optionen "Reitunterricht", "Ponyreiten" ersetzen) |
| `src/types/index.ts` | `Price`-Interface ggf. erweitern (z.B. Teilnehmer, Voraussetzungen) |
| `src/components/ui/ContactForm.tsx` | Betreff-Optionen aktualisieren |

### Zu löschen

| Datei | Grund |
|---|---|
| `src/app/angebote/reitunterricht/page.tsx` | Reitunterricht gibt es nicht mehr als eigenes Angebot |
| `src/app/angebote/ponyreiten/page.tsx` | Ponyreiten gibt es nicht mehr als eigenes Angebot |

### Neu zu erstellen

| Datei | Inhalt |
|---|---|
| `src/app/angebote/fuehrungskraefte-coaching/page.tsx` | Detailseite: Coaching für Führungskräfte |
| `src/app/angebote/teambuilding/page.tsx` | Detailseite: Teambuilding |
| `src/app/angebote/erlebnistag/page.tsx` | Detailseite: Raus aus dem Alltag |
| `src/app/angebote/extreme-trail/page.tsx` | Detailseite: Extreme-Trail Park |
| `src/app/angebote/working-equitation/page.tsx` | Detailseite: Working-Equitation |
| `src/app/angebote/garrocha/page.tsx` | Detailseite: Garrocha |

---

## Umsetzungsschritte

### Schritt 1 — Daten aktualisieren
`src/lib/constants.ts` anpassen:
- `ANGEBOTE`-Array mit den 6 neuen Angeboten befüllen (Titel, Kurzbeschreibung, Link, Bild-Platzhalter)
- `PRICES`-Array neu strukturieren (6 Angebote statt der alten 6 Preisstufen, Preise als Platzhalter)
- Typen in `src/types/index.ts` erweitern falls nötig

### Schritt 2 — Alte Detailseiten entfernen, neue anlegen
- `src/app/angebote/reitunterricht/` löschen
- `src/app/angebote/ponyreiten/` löschen
- 6 neue Detailseiten erstellen (siehe Tabelle oben)
- Jede Seite bekommt: Hero-Bereich, Beschreibung, Themen/Details-Liste, Teilnehmer-Info, Besonderheiten, CTA zur Kontaktseite

### Schritt 3 — Übersichtsseite neu aufbauen
`src/app/angebote/page.tsx` überarbeiten:
- Zwei Sektionen: **Seminare & Coaching** und **Workshops & Training**
- Jeweils Karten mit Kurztext und Link zur Detailseite

### Schritt 4 — Homepage aktualisieren
`src/app/page.tsx` Angebote-Sektion:
- Auswahl der wichtigsten/attraktivsten Angebote zeigen (z.B. Führungskräfte-Coaching, Extreme-Trail, Erlebnistag)
- CTA anpassen ("Angebot anfragen" statt "Schnupperstunde vereinbaren")

### Schritt 5 — Preise-Seite anpassen
`src/app/preise/page.tsx`:
- Alte Preiskategorien (Einzelunterricht, 5er-Karte, 10er-Karte etc.) durch neue Angebote ersetzen
- Preise bleiben als Platzhalter "[Preis auf Anfrage]"
- Hinweis: "Individuelle Angebote für Unternehmen — kontaktieren Sie uns"

### Schritt 6 — Kontaktformular anpassen
Betreff-Dropdown aktualisieren:
- Alte Optionen: ~~Reitunterricht, Ponyreiten, Schnupperstunde, Sonstiges~~
- Neue Optionen: Führungskräfte-Coaching, Teambuilding, Erlebnistag/Team-Event, Extreme-Trail, Working-Equitation, Garrocha, Sonstiges

### Schritt 7 — SEO & Metadaten
- Neue `metadata` für jede Detailseite (title, description)
- Beispiel: "Pferdegestütztes Führungskräfte-Coaching — Reiterhof Mandy Kolatka, Zwenkau"

### Schritt 8 — Testen
- Alle Links prüfen (keine toten Links auf alte Seiten)
- Navigation testen (mobil + desktop)
- Build testen (`npm run build`)

---

## Offene Fragen

- [ ] **Bilder:** Gibt es neue Fotos für die Angebote? (Coaching-Szenen, Extreme-Trail Park, Working-Equitation etc.) — aktuell müssten Platzhalter verwendet werden
- [ ] **Preise:** Sollen Preise auf der Website stehen oder nur "auf Anfrage"?
- [ ] **Seitenstruktur:** Sollen Seiten wie `/pferde` (Unsere Pferde) und `/galerie` bestehen bleiben?
- [ ] **CLAUDE.md:** Soll die Projektdokumentation ebenfalls aktualisiert werden, um die neue Angebotsstruktur abzubilden?
