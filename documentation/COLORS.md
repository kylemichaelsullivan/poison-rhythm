# Color Preferences — Poison Rhythm

Classroom-facing notes on **Settings → Look** colors: dominant/secondary from a Crayola 64 tray, WCAG contrast grades, and why Brand stays the default.

For full accessibility policy (grades, border hierarchy, keyboard), see [`A11Y.md`](A11Y.md). For theme and display mode, see the same **Settings → Look** tab. For agents and schema wiring, see [`AGENTS.md`](../AGENTS.md).

## What Dominant and Secondary control

| Role | UI effect |
|------|-----------|
| **Dominant** | Primary accent: Play fills, badges, section titles, playback highlights, purple-family atmosphere |
| **Secondary** | Complement accent: primary borders, mint-family atmosphere |

Unset preferences keep the shipped **Poison Rhythm** purple + mint tokens from the favicon brand. Choosing crayons overrides those CSS variables for this browser (student-scoped local storage today).

## Why Brand is recommended

- **Recognition** — the potion purple / deep mint look is the product signal on projected screens and shared devices.
- **Classroom consistency** — one default pair means every station looks familiar when students rotate.
- **Best contrast grade** — Brand purple-deep (`#783b82`) + deep mint (`#246028`) score **Grade A** (WCAG 2.2 AAA floor) in both light and dark. Suggested Pairings only list pairs that earn **A or B**.

The Look tab marks **Poison Rhythm** as Recommended in Suggested Pairings.

## Color theory (short)

- **Complementary** pairs (e.g. blue & orange) sit opposite on the hue wheel — high energy, easy to separate dominant from secondary.
- **Analogous** pairs (e.g. violet & soft green) neighbor each other — calmer, still readable when luminance differs.
- Poison Rhythm’s brand pair is a cool purple dominant with a green secondary border: complementary enough for chrome, soft enough for long sessions.

Avoid near-identical crayons for both roles — borders disappear and badges lose shape.

## Mitigating decision fatigue

- Only **two roles** (not a free hex picker or full theme editor).
- Full tray for personal expression; **Suggested Pairings** sit below the tray as a fast recovery path (Brand first). Swatches are **squares** in four Crayola-style sleeves (16 each, 2×8), stacked in **portrait** and labeled Sleeve 1–4.

## Contrast grades

Each crayon badge grades that swatch **against the other role’s current color** (Dominant vs Secondary). The pair meter still summarizes classroom surface readiness. See [`A11Y.md`](A11Y.md).

**Strongly discourage, do not block:** the pair meter and per-swatch grade badges update live. Grade **A/B** get solid hierarchy borders; **F** is dashed and dimmed. Suggested Pairings remain the easy recovery.

## Student profiles (later)

Color preferences are stored on **student-scoped** preference keys (`poison-rhythm-dominant-color`, `poison-rhythm-secondary-color`), same family as theme and tempo. They are intended to move into student profiles when that feature ships. Profile UI and account sync are **not** implemented yet.

## Related

- [`A11Y.md`](A11Y.md) — contrast grades, border hierarchy, keyboard
- [`TEACHERS.md`](TEACHERS.md) — classroom arcs and accessibility tips
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — providers and settings layers
- [`src/index.css`](../src/index.css) — brand and semantic color tokens
- [`src/lib/hierarchy-border.ts`](../src/lib/hierarchy-border.ts) — shared border ranks
