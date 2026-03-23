# Claude Code Redesign Prompt — See-Pferde Zwenkau

Copy and paste this entire prompt into Claude Code to execute the redesign.

---

## The Prompt

```
I need you to redesign this Next.js website based on a new mockup. The site is a horse training facility website built with Next.js App Router, TypeScript, and Tailwind CSS v4 (static export). Read the CLAUDE.md first for full project context.

## Brand Change

The brand is changing from "Reiterhof Mandy Kolatka" to **"See-Pferde Zwenkau"**. Update the brand name everywhere: site.json, metadata, navigation, footer, page titles, alt texts, structured data — anywhere the old name appears.

## New Color Palette

Replace the entire existing color system with this new palette:

| Role | Old Color | New Color | Hex |
|---|---|---|---|
| Primary | Waldgrün #4A6741 | Dusty Mauve | #8B4D6B |
| Secondary | Warmes Braun #8B6F47 | Warm Rose | #C4A6A6 |
| Accent / CTAs | Sonnengelb #D4A843 | Deep Burgundy | #7A3B54 |
| Background | Cremeweiß #FAF7F2 | Soft Blush Cream | #FAF5F3 |
| Background Alt | Sanftes Beige #F0EBE1 | Light Mauve | #F0E8E8 |
| Text Primary | Dunkelbraun #3D2E1F | Dark Charcoal | #2D2426 |
| Text Secondary | Warmgrau #6B5E50 | Muted Mauve | #6B5560 |
| Footer/Dark BG | Waldgrün dark | Deep Mauve | #3D2A35 |
| Header BG | — | Soft cream/transparent | #FAF5F3 or transparent |

Update ALL color definitions — in globals.css (Tailwind CSS custom properties / theme), any tailwind.config if present, and any hardcoded hex values in components. The color variable names can stay the same (--color-primary, etc.) but the values must change.

Also update gradient overlays on hero sections: change from green-tinted (#2A3F28) to mauve-tinted (#3D2A35).

## Navigation Redesign

Current: Sticky header with green tones.
New design:
- Clean white/cream background (#FAF5F3), horizontal top bar
- Logo (See-Pferde Zwenkau + horse icon) on the left
- Navigation links centered or right-aligned: Willkommen, Angebote, Workshops, Hof-Infos, Kontakt
- Rename the nav labels in site.json:
  - "Startseite" → "Willkommen"
  - "Über uns" → "Hof-Infos"
  - "Angebote" stays
  - "Preise" → merge into relevant pages or keep
  - "Galerie" → keep or merge into "Hof-Infos"
  - "Veranstaltungen" → "Workshops"
  - "Kontakt" stays
- Add a CTA button on the right: "Buchen" (deep burgundy #7A3B54 background, white text, rounded-lg)
- The "Buchen" button links to /kontakt

## Logo

Replace the current logo files (public/icons/logo.svg and logo.png) with the new logo assets once they are generated. For now, update the logo text fallback to show "See-Pferde Zwenkau" and update all alt texts.

## Section Dividers

There are now TWO different divider styles:

1. **Horse Divider** (primary, used after hero sections): A centered small horse illustration with thin lines extending left and right. Replace the current botanical SVG divider with a new SVG/image. The image file will be at `/images/decorative/divider-horse.svg` (or .png/.jpeg once generated).

2. **Ornamental Divider** (secondary, used between content sections): A simple thin line with a small centered scroll/flourish ornament. Simpler and more subtle than the horse divider.

Create two SectionDivider variants or a prop to switch between them: `<SectionDivider variant="horse" />` and `<SectionDivider variant="ornament" />` (default to "horse").

## Hero Section

The mockup shows:
- Full-width hero image (the facility panorama with arena, horses, lake)
- Darker gradient overlay from bottom (mauve-tinted, not green)
- Large white heading: "Willkommen bei See-Pferde Zwenkau"
- Subtitle text below in white
- White outlined/ghost button: "Hier informieren" (white border, white text, transparent background, hover: filled white with dark text)
- The existing WatercolorCanvas effect can stay but adjust its color tint to match the new mauve palette

## Homepage Content Sections

### Section 1: "Ein Ort, an dem Pferdeträume wahr werden"
- Horse divider above
- Two-column layout: text on left, decorative watercolor horse illustration on right (this image already exists)
- Warm blush cream background
- Heading + 2-3 paragraphs of text

### Section 2: "Unsere Angebote"
- Centered section heading
- 3 offering cards in a row (the current card component, but only showing 3 featured)
- Cards: rounded image on top, title below, short description, no explicit button — the whole card is clickable
- Card styling: white background, subtle shadow, rounded-xl corners, warm border

### Section 3: Full-width Event Banner
- Full-width background image (dark overlay, parallax-style or fixed)
- Large centered white heading: event title (e.g., "Extreme Trail Workshop – Frühlingskurs")
- Subtitle text
- Centered CTA button: "Mehr Erfahren" in deep burgundy (#7A3B54)

### Section 4: "Lernen Sie den Hof kennen"
- Two-column: image on left (facility exterior shot), text on right
- Heading + description + bullet points listing key offerings
- CTA button: "Zum Hof" in deep burgundy

## Button Styles

Update the Button component with the new colors:
- **Primary:** Deep burgundy (#7A3B54) background, white text, rounded-lg, hover: slightly darker
- **Secondary/Outline:** White or cream background, burgundy border, burgundy text, hover: filled burgundy
- **Ghost (hero):** Transparent background, white border, white text, hover: white fill with dark text

## Footer

- Deep mauve background (#3D2A35) — much darker than the main site
- Three columns: contact info (left), navigation links (center), location/hours (right)
- Logo in the footer (horse icon + "See-Pferde Zwenkau") in white/cream
- Small decorative horse icon or flourish above the footer columns
- Muted text colors (light mauve/cream on dark background)
- Bottom bar: copyright "See-Pferde Zwenkau"

## Typography

Keep the current font structure (serif headings + sans-serif body) but check that the heading font pairs well with the new mauve palette. The mockup uses a slightly more elegant/refined serif — consider switching to Playfair Display if not already used. Ensure letter-spacing on section labels (the small uppercase "UNSERE ANGEBOTE" type labels) uses wider tracking.

## General

- Keep all existing page routes and functionality intact
- Keep the static export configuration (output: "export")
- Keep all existing images — only colors, layout, and branding text change
- Keep the contact form functionality
- Mobile responsive behavior stays the same (hamburger menu on mobile)
- Update the mobile menu colors to match the new palette
- Make sure to search globally for any hardcoded old brand name strings and replace them
```

---

## Checklist After Running This Prompt

- [ ] Brand name updated everywhere (site.json, metadata, footer, pages)
- [ ] Color palette fully swapped (CSS variables, hardcoded hex values, gradients)
- [ ] Navigation updated (new labels, "Buchen" button added)
- [ ] Hero section updated (new text, mauve gradient, ghost button style)
- [ ] Two divider variants created (horse + ornament)
- [ ] Button styles updated (burgundy primary, outline, ghost)
- [ ] Footer redesigned (dark mauve background, 3 columns)
- [ ] Mobile menu colors updated
- [ ] Homepage sections match mockup layout
- [ ] No broken references (images, links, routes)
- [ ] ESLint passes clean
- [ ] Build succeeds (`npm run build`)
