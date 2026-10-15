# Color Preferences — Poison Rhythm

Classroom-facing notes on **Settings → Colors**: dominant/secondary from a Crayola 64 tray, letter-grade contrast, and why Brand stays the default.

For full accessibility policy (grades, border hierarchy, keyboard), see [`A11Y.md`](A11Y.md). For theme and display mode, see **Settings → Look**. For agents and schema wiring, see [`AGENTS.md`](../AGENTS.md).

## What Dominant and Secondary control

| Role | UI effect |
|------|-----------|
| **Dominant** | Primary accent: Play fills, badges, section titles, page wash, panel surfaces, header edge, playback highlights |
| **Secondary** | Complement accent: section borders, footer edge, chrome bars, opposite page wash, title gradient |

Unset preferences keep the shipped **Poison Rhythm** purple + mint tokens from the favicon brand. Choosing crayons overrides those CSS variables for this browser (student-scoped local storage today).

## Why Brand is recommended

- **Recognition** — the potion purple / deep mint look is the product signal on projected screens and shared devices.
- **Classroom consistency** — one default pair means every station looks familiar when students rotate.
- **Product pair** — Brand purple-deep (`#783b82`) + deep mint (`#246028`) is the default look. Suggested Pairings are grade **A** (7:1 between the two colors) across yellow, green, blue, orange, pink, cyan, violet, and earth.

The Colors tab marks **Poison Rhythm** as Recommended in Suggested Pairings.

## Color theory (short)

- **Complementary** pairs (e.g. blue & orange) sit opposite on the hue wheel — high energy, easy to separate dominant from secondary.
- **Analogous** pairs (e.g. violet & soft green) neighbor each other — calmer, still readable when luminance differs.
- Poison Rhythm’s brand pair is a cool purple dominant with a green secondary border: complementary enough for chrome, soft enough for long sessions.

Avoid near-identical crayons for both roles — borders disappear and badges lose shape.

## Mitigating decision fatigue

- Only **two roles** (not a free hex picker or full theme editor).
- Full tray for personal expression; **Suggested Pairings** sit below the tray as a fast recovery path (Brand first). Swatches are **squares** in four Crayola-style sleeves (16 each, 2×8), stacked in **portrait** and labeled Sleeve 1–4.

## Contrast grades

The pair meter (`rateColorPairContrast`) shows one **US letter grade** and one ratio: Dominant against Secondary. Grade **A** is 7:1 or better. Each swatch badge previews that same meter **if you pick that crayon** for the active role (`ratePairIfRolePicked`), keeping the other role fixed. See [`A11Y.md`](A11Y.md).

**Strongly discourage, do not block:** the pair meter (`ContrastScoreMeter`) and per-swatch grade badges (`ContrastGradeBadge` on `CrayonSwatch`) update live. Role tiles live in `ColorRoleTile`; the decorative strip is `ColorPairPlayPreview`. **A/B** get solid hierarchy borders; **F** is dashed and dimmed. In the tray, the active role’s crayon uses strongest border/shadow; the other role’s crayon stays visible at lighter emphasis (switches when you change Dominant vs Secondary). Suggested Pairings remain the easy recovery.

## Student profiles (later)

Color preferences are stored on **student-scoped** preference keys (`poison-rhythm-dominant-color`, `poison-rhythm-secondary-color`), same family as theme and tempo. They are intended to move into student profiles when that feature ships. Profile UI and account sync are **not** implemented yet.

## Related

- [`A11Y.md`](A11Y.md) — contrast grades, border hierarchy, keyboard
- [`TEACHERS.md`](TEACHERS.md) — classroom arcs and accessibility tips
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — providers and settings layers
- [`src/index.css`](../src/index.css) — brand and semantic color tokens
- [`IOS.md`](IOS.md) — WebKit color fallbacks (hex defaults, crayon hex overrides)
- [`src/lib/hierarchy-border.ts`](../src/lib/hierarchy-border.ts) — shared border ranks
