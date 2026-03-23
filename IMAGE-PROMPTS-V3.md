# Bildprompts v3 — Nano Banana Pro / Face Consistency Edition

## Workflow-Anleitung (vor dem Generieren lesen!)

### Schritt 1: Character Reference Sheet erstellen
Bevor du die Bilder generierst, lade diese 3 Referenzfotos gemeinsam als Character Reference hoch:

| # | Datei | Zweck |
|---|---|---|
| 1 | `public/reference/IMG_0972.JPG` | **Primär** — Frontal, klares Gesicht, direkter Blick |
| 2 | `public/reference/IMG_0975.JPG` | **Sekundär** — Leicht anderer Winkel, Ganzkörper |
| 3 | `public/reference/WhatsApp Image 2026-02-22 at 15.12.55.jpeg` | **Kontext** — Mit Pferd, zeigt Statur und Haltung |

### Schritt 2: Für jedes Bild zusätzlich die passende Style Reference hochladen
Siehe Tabelle am Ende dieses Dokuments.

### Schritt 3: Prompts in genau dieser Reihenfolge generieren
Beginne mit dem Profilbild (einfachste Pose), dann Führungskräfte-Coaching, Erlebnistag, Garrocha (komplexeste Pose). So baut sich die Konsistenz schrittweise auf.

---

## Identity Lock Block (in jedem Prompt enthalten)

> Jeder Prompt beginnt mit demselben Identity Lock Block. Das ist das Kernstück für die Gesichtskonsistenz. NICHT weglassen, NICHT umformulieren.

---

## Profilbild — Mandy Kolatka ⭐

**Dateiname:** `mandy-portrait.jpeg`
**Format:** 3:4 Hochformat (1080×1440px)
**Character Reference:** IMG_0972, IMG_0975, WhatsApp 15.12.55
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.30.39.jpeg`

**Prompt:**
```
[IDENTITY LOCK] This image must depict the exact same woman shown in the uploaded reference images. Maintain her precise facial features across this generation: same eye shape and spacing, same nose bridge and tip, same jawline contour and chin shape, same lip proportions, same brow arch, same skin tone and texture. Do not alter, idealize, or age her face. Her identity must be immediately recognizable as the reference person.

Photorealistic portrait photograph. The woman sits relaxed in a sandy horse paddock between her two horses who are both lying down in the sand — a golden palomino with a flaxen cream mane on her left, and a dark bay (nearly black) horse with a broad white blaze on her right. Both horses rest peacefully, heads low, completely trusting. She has long wavy brown-auburn hair past her shoulders. She wears a dark fitted jacket or quilted vest and riding leggings. She smiles warmly and genuinely, one hand resting gently on each horse's neck. Behind them: a natural wood stable building, wooden paddock fencing, and modern white apartment buildings with glass balconies softly blurred in the background. Clear blue sky, bright winter/spring sunlight casting clean shadows on the sand. The mood is intimate, trusting, deeply connected. Warm natural color palette. Professional portrait photography, 85mm lens, f/2.8, shallow depth of field.
```

---

## 1. Führungskräfte-Coaching ⭐

**Dateiname:** `fuehrungskraefte-coaching.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** IMG_0972, IMG_0975, WhatsApp 15.12.55
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.35.04.jpeg`

**Prompt:**
```
[IDENTITY LOCK] This image must depict the exact same woman shown in the uploaded reference images. Maintain her precise facial features across this generation: same eye shape and spacing, same nose bridge and tip, same jawline contour and chin shape, same lip proportions, same brow arch, same skin tone and texture. Do not alter, idealize, or age her face. Her identity must be immediately recognizable as the reference person.

Photorealistic professional photograph, warm golden hour light. The woman stands in a sand-footed arena guiding a business-dressed participant through a ground-level horse coaching exercise. She wears an olive quilted vest over a dark top, brown riding pants, and tall leather boots. Her long wavy brown-auburn hair is loose. She gestures calmly toward her dark bay horse (deep brown, nearly black coat, broad white blaze, wearing a rope halter / knotted halter) with quiet authority and confidence. The participant reaches out a hand toward the horse's muzzle — a quiet moment of connection. The sand arena has simple wooden post-and-rail fencing. In the soft-focus background: modern white apartment buildings with glass balconies and a glimpse of the Zwenkauer See (wide lake) behind them. Late afternoon golden light casts long warm shadows across the sand. No saddle, no riding — all interaction on the ground. Natural Horsemanship style. 85mm lens, f/2.8, warm earth tones, professional editorial photography.
```

---

## 2. Teambuilding

**Dateiname:** `teambuilding.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** keine (Mandy nicht im Bild)
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.17.37.jpeg`

**Prompt:**
```
Photorealistic professional photograph, warm natural light. A small group of 4-5 adults in casual outdoor clothing stand together with a golden palomino horse (cream/gold coat, flaxen white mane, wearing a rope halter / knotted halter) in a sandy paddock. They form a loose circle — one person holds the lead rope while others observe, collaborate, and react with genuine engagement and laughter. The palomino stands calmly in the middle, relaxed and trusting. The distinctive setting: a sandy paddock with simple wooden fencing, and directly behind it a sleek turquoise swimming pool with wooden designer loungers on a stone terrace. In the background, modern white multi-story apartment buildings with flat roofs and glass balconies, with the wide Zwenkauer See visible beyond. Late afternoon golden hour light, warm tones on skin and horse coat. No riding — all interaction on the ground. Collaborative, energized mood. Documentary-style candid photography, 35mm lens, f/4. Natural earth tones with the urban-meets-equestrian contrast.
```

---

## 3. Erlebnistag ⭐

**Dateiname:** `erlebnistag.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** IMG_0972, IMG_0975, WhatsApp 15.12.55
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.20.37.jpeg`

**Prompt:**
```
[IDENTITY LOCK] This image must depict the exact same woman shown in the uploaded reference images. Maintain her precise facial features across this generation: same eye shape and spacing, same nose bridge and tip, same jawline contour and chin shape, same lip proportions, same brow arch, same skin tone and texture. Do not alter, idealize, or age her face. Her identity must be immediately recognizable as the reference person.

Photorealistic professional photograph, golden afternoon light. Elevated wide-angle shot showing the unique equestrian facility from above. In the foreground, the woman (long wavy brown-auburn hair, casual equestrian clothing — quilted vest or softshell jacket) warmly welcomes a small group of visitors near a crackling firepit with rustic wooden bench seating. In the sandy paddock nearby, her palomino horse (golden coat, flaxen mane) and dark bay horse (nearly black, white blaze) graze freely. The full setting is visible: a natural wood stable building, sandy paddock with wooden fencing, a turquoise swimming pool with rows of wooden designer loungers on a stone terrace, and modern white apartment buildings with flat roofs and glass balconies surrounding the property. In the far background, the wide Zwenkauer See stretches to a tree-lined horizon. Festive, relaxed atmosphere — nature, community, and horses in an unexpected urban-lakeside setting. Wide-angle editorial photography, 24mm lens, f/5.6. Rich greens, warm golden sunlight, turquoise pool water, earthy sand tones.
```

---

## 4. Extreme-Trail

**Dateiname:** `extreme-trail.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** keine (Mandy nicht im Bild)
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.24.55 (2).jpeg` + `WhatsApp Image 2026-02-22 at 15.23.28.jpeg`

**Prompt:**
```
Photorealistic professional photograph, natural daylight with overcast sky. A dark bay horse (deep brown, nearly black coat, broad white blaze, wearing a rope halter) confidently walks across a wooden log bridge built from round timber on an extreme trail course. The course is built on a raw, sandy earthen hill — visible obstacles include: stacked log walls forming small tunnels, large natural boulders and flat sandstone rocks, timber framework structures, and the wooden plank bridge the horse is crossing. Young planted pine trees and green saplings are growing between the raw sandy earth. A handler in earth-toned outdoor clothing walks calmly alongside, guiding with a loose lead rope. In the background: modern white apartment buildings with flat roofs and glass balconies, and the wide Zwenkauer See on the horizon. The key visual contrast: raw natural obstacle course with rough timber and boulders against sleek contemporary architecture. Earthy tones: sand, raw timber, green saplings, grey rocks. Outdoor action photography, 50mm lens, f/4. Sharp focus on horse navigating the log bridge.
```

---

## 5. Working-Equitation

**Dateiname:** `working-equitation.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** keine (Mandy nicht im Bild)
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.35.04.jpeg`

**Prompt:**
```
Photorealistic professional photograph, warm natural light. A rider on the golden palomino horse (cream/gold coat, flaxen white mane and tail, rope halter or simple bitless bridle) navigates a working equitation trail course in a sand arena. The horse approaches a wooden gate obstacle, ears forward, attentive and collected. Visible course elements in the arena: barrels, slalom poles, a metal grate platform on a wooden base (podium/pedestal). The rider sits balanced with soft hands, guiding with precision. Sand arena with wooden post-and-rail fencing. In the background, modern white apartment buildings of the Zwenkauer See lakeside development, lake partially visible. Late afternoon golden hour light, dust particles catching the sun. Rich contrast: warm sand tones, golden palomino coat, green grass border, contemporary architecture behind. Focused, elegant mood — horse and rider in precise partnership. Sports equestrian photography, 200mm lens, f/2.8, shallow depth of field isolating horse and rider.
```

---

## 6. Garrocha ⭐

**Dateiname:** `garrocha.jpeg`
**Format:** 16:9 Querformat (1920×1080px)
**Character Reference:** IMG_0972, IMG_0975, WhatsApp 15.12.55
**Style Reference:** `WhatsApp Image 2026-02-22 at 15.14.46.jpeg`

**Prompt:**
```
[IDENTITY LOCK] This image must depict the exact same woman shown in the uploaded reference images. Maintain her precise facial features across this generation: same eye shape and spacing, same nose bridge and tip, same jawline contour and chin shape, same lip proportions, same brow arch, same skin tone and texture. Do not alter, idealize, or age her face. Her identity must be immediately recognizable as the reference person.

Photorealistic professional photograph, warm golden hour light. The woman rides her palomino horse (golden/cream coat, flaxen white mane flowing in motion) while holding a long garrocha pole (wooden lance, approximately 3-4 meters) upright at a slight angle. She has long wavy brown-auburn hair flowing behind her. She wears dark fitted riding clothing — black jacket or top, riding leggings, tall boots. The palomino moves in a collected, elevated canter — proud, expressive movement with front legs lifted, mane flowing. Setting: a sand-footed arena with wooden fencing, modern white apartment buildings of the Zwenkauer See development softly blurred in the background. Beautiful backlighting creates a golden rim light on horse, rider, and the flowing flaxen mane. Dust rises softly from the sandy footing. Warm golden tones, dramatic light-and-shadow contrast. Movement, tradition, and the artistry of this Iberian riding discipline. Equestrian fine art photography, 135mm lens, f/2.0, shallow depth of field, slight motion blur in the mane.
```

---

## Schnellreferenz: Was hochladen pro Bild

| # | Bild | Character Ref (Mandy) | Style Ref (Umgebung) |
|---|---|---|---|
| 0 | **Profilbild** | IMG_0972 + IMG_0975 + WA 15.12.55 | WA 15.30.39 |
| 1 | **Führungskräfte** | IMG_0972 + IMG_0975 + WA 15.12.55 | WA 15.35.04 |
| 2 | **Teambuilding** | — | WA 15.17.37 |
| 3 | **Erlebnistag** | IMG_0972 + IMG_0975 + WA 15.12.55 | WA 15.20.37 |
| 4 | **Extreme-Trail** | — | WA 15.24.55(2) + WA 15.23.28 |
| 5 | **Working-Equitation** | — | WA 15.35.04 |
| 6 | **Garrocha** | IMG_0972 + IMG_0975 + WA 15.12.55 | WA 15.14.46 |

## Pferde-Referenz (optional als zusätzliche Referenz hochladen)

| Pferd | Datei |
|---|---|
| **Palomino** | `WhatsApp Image 2026-02-22 at 15.12.55.jpeg` |
| **Dunkelbrauner** | `WhatsApp Image 2026-02-22 at 15.14.03.jpeg` |
| **Beide zusammen** | `WhatsApp Image 2026-02-22 at 15.16.07.jpeg` |

## Tipps für beste Ergebnisse

- **Reihenfolge einhalten:** Profilbild → Führungskräfte → Erlebnistag → Garrocha (einfach → komplex)
- **Immer dieselben 3 Character References** für alle Mandy-Bilder verwenden — nicht wechseln
- **Nicht das Gesicht in Text beschreiben** — lass die Referenzbilder die Arbeit machen
- **Identity Lock Block nicht kürzen** — der vollständige Block ist getestet für beste Konsistenz
- **Eine Variable pro Bild ändern** — Pose und Szene ändern sich, Licht und Stil bleiben gleich (Golden Hour, warm, editorial)
- **Bei Edit/Inpainting-Modus:** Nur das Gesicht maskieren, Rest unberührt lassen. Prompt: "Replace the face to match the reference images exactly. Keep pose, hair, lighting, clothing, and background completely unchanged."

## Speicherorte

| Datei | Pfad |
|---|---|
| Profilbild | `public/images/team/mandy-portrait.jpeg` |
| 6 Angebote | `public/images/angebote/[dateiname].jpeg` |
