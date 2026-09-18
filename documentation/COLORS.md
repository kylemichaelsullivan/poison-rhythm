# Color Preferences — Poison Rhythm

Classroom-facing notes on **Settings → Look** colors: dominant/secondary from a Crayola 64 tray, contrast warnings, and why Brand stays the default.

For theme (light / dark / system) and display mode, see the same **Settings → Look** tab. For agents and schema wiring, see [`AGENTS.md`](../AGENTS.md).

## What Dominant and Secondary control

| Role | UI effect |
|------|-----------|
| **Dominant** | Primary accent: Play fills, badges, section titles, playback highlights, purple-family atmosphere |
| **Secondary** | Complement accent: primary borders, mint-family atmosphere |

Unset preferences keep the shipped **Poison Rhythm** purple + mint tokens from the favicon brand. Choosing crayons overrides those CSS variables for this browser (student-scoped local storage today).

## Why Brand is recommended

- **Recognition** — the potion purple / mint glass look is the product signal on projected screens and shared devices.
- **Classroom consistency** — one default pair means every station looks familiar when students rotate.
- **Contrast already vetted** — Brand meets WCAG-oriented thresholds used by the in-app validators.

The Look tab marks **Poison Rhythm** as Recommended in Suggested Pairings.

## Color theory (short)

- **Complementary** pairs (e.g. blue & orange) sit opposite on the hue wheel — high energy, easy to separate dominant from secondary.
- **Analogous** pairs (e.g. violet & soft green) neighbor each other — calmer, still readable when luminance differs.
- Poison Rhythm’s brand pair is a cool purple dominant with a green secondary border: complementary enough for chrome, soft enough for long sessions.

Avoid near-identical crayons for both roles — borders disappear and badges lose shape.

## Mitigating decision fatigue

- Only **two roles** (not a free hex picker or full theme editor).
- Full tray for personal expression; **Suggested Pairings** sit below the tray as a fast recovery path (Brand first). Swatches are **squares** in four Crayola-style sleeves (16 each, 2×8), stacked in **portrait** (sleeves one above another instead of side-by-side).

## Accessibility

Validators score crayons against WCAG 2.1 **AA** ideas:

- **4.5:1** for text on dominant fills (`on-primary` is chosen automatically — users never pick ink).
- **3:1** for UI accents vs light and dark page surfaces. Curated pairings also check dominant↔secondary separation; Brand is always offered even when that pair sits under 3:1.

**Strongly discourage, do not block:** choosing a crayon that fails **its own role** contrast opens an **Insufficient Contrast** modal. Teachers can **Cancel** or **Use Anyway**. The tray marks those swatches visually; Suggested Pairings (including Brand) remain the easy recovery.

Do not rely on accent color alone for poison identity or playback state — layout, labels, and motion already carry those meanings.

**Projection tip:** very bright yellows/whites can wash out on classroom projectors; Brand remains the safer teaching default.

## Student profiles (later)

Color preferences are stored on **student-scoped** preference keys (`poison-rhythm-dominant-color`, `poison-rhythm-secondary-color`), same family as theme and tempo. They are intended to move into student profiles when that feature ships. Profile UI and account sync are **not** implemented yet.

## Related

- [`TEACHERS.md`](TEACHERS.md) — classroom arcs and accessibility tips
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — providers and settings layers
- [`src/index.css`](../src/index.css) — brand and semantic color tokens
