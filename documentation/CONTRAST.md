# Color Contrast — Settings → Colors

How the grade stack works while someone picks a Dominant or Secondary crayon. Agents changing this UI should follow this file. The skill is [`.cursor/skills/color-contrast/SKILL.md`](../.cursor/skills/color-contrast/SKILL.md).

**Composition:** `ColorAccentSettings` owns `useColorPreferences` (+ `useColorRoleSelection` / `usePaletteContrast`) and prop-drives `ColorPairPreview`, `CrayonTray`, and `SuggestedPairings`. `ContrastScoreMeter` owns `useTheme` so Light/Dark taps do not rescore the 64-crayon tray. Tray grades memoize on role + partner hex. Do not re-bind prefs on presentational leaves (`ThemeScoreRow`, `CrayonSwatch`, …).

Letter thresholds live in [`A11Y.md`](A11Y.md). Product notes live in [`COLORS.md`](COLORS.md).

## What the user is doing

One role is selected. The tray edits that role and holds the other role fixed.

| Theme | Selected role | The user is choosing | Held fixed |
|-------|----------------|----------------------|------------|
| Light | Dominant | A new Dominant | Current Secondary |
| Light | Secondary | A new Secondary | Current Dominant |
| Dark | Dominant | A new Dominant | Current Secondary |
| Dark | Secondary | A new Secondary | Current Dominant |

Each swatch previews that pick (`ratePaletteIfRolePicked`). The meter shows the pair already chosen (`ratePaletteThemes`). Both use the same two scores:

- **Light Mode score** — how that pair reads for accessibility in Light Mode.
- **Dark Mode score** — how that pair reads for accessibility in Dark Mode.

A score is the weaker of the two roles on that theme’s surfaces. For Dominant, that is text on the fill and the accent against the page. For Secondary, that is the accent against the page. Dark Mode scores the brightened accent (`ACCENT_BRIGHTEN_FOR_DARK`). The same crayon in both roles is **F** in both modes.

## Stack order

Markup order is always Light, then Dark. **Visual order matches:** Light stays on top in every theme — meter bars and swatch chips. Do not reorder with flex `order`, React, or `light-dark()`. Theme clicks on the meter must hit the same bar after a preference change.

Chip and bar fills use stable `--color-ink-*` (`bg-ink-100` / `bg-ink-950`), not theme-flipping `black` / `white` / `chrome`. Otherwise Dark Mode inverts the Light chip into a dark chip and the stack looks swapped even when Light is still on top.

Swatch chips are the letter only. The meter is one rounded box with Light chrome and Dark ink rows flush (no gap). Each row is a theme button: bulb on the left (lit = this row is locked; shaded = idle), ratio + letter on the right. Related to the swatch badges, not a copy of them. The weaker grade sets the swatch border. Picks are never blocked. The Play Preview is a mini measure grid (Dominant hits, Secondary borders) with a Secondary step ring on one hit and one rest.

## Theme bars on the meter

Each score row is the theme control for that mode. Labels are **Light Mode**, **Dark Mode**, and **Match System**. Preference (not effective appearance) drives taps:

| Current preference | Tap | Next preference |
|--------------------|-----|-----------------|
| Light Mode | Light Mode bar | Match System |
| Light Mode | Dark Mode bar | Dark Mode |
| Dark Mode | Light Mode bar | Light Mode |
| Dark Mode | Dark Mode bar | Match System |
| Match System | either bar | that mode |

Icons encode **selection**, not mode identity: **lit** rayed bulb on the locked row, **shaded** bulb on idle rows. Match System shows both shaded; Light Mode lights the Light row; Dark Mode lights the Dark row. Selected bars also get an inset primary ring. Idle bulbs stay at reduced opacity but remain readable (especially the shaded bulb on dark ink). Bar fills use stable `--color-ink-*` tokens (light chrome / dark ink) so they do not invert when the page is in Dark Mode — theme-flipping `black` / `white` / `chrome` would swap the two rows visually. The caption under the meter is Light Mode / Dark Mode / Match System.

## Default pair

Dominant `#914893` (favicon purple). Secondary `#246028` (green complement). That pair is grade **B** in Light Mode and **A** in Dark Mode.

## Layering

`ColorAccentSettings` is the Colors composer (prefs + edit role). `ContrastScoreMeter` binds theme; `CrayonTray` / `SuggestedPairings` / preview take palette props only.

## Do not drift

- Do not score the selected role against itself. The partner is the other role.
- Do not collapse the two scores into one letter on the meter or the swatch.
- Do not put the mode label on the meter or swatch. Position carries Light vs Dark. The accessible name on the meter still says both modes.
- Do not reuse `ContrastGradeBadge` for the meter. Swatches own the small chip; the meter is its own compact grade + ratio rows.
- Do not reorder the Light/Dark stack with JavaScript, flex `order`, or `light-dark()`. Light stays on top.
- Do not fill meter bars or swatch chips with theme-flipping `black` / `white` / `chrome`.
