---
name: color-contrast
description: >-
  Explains Poison Rhythm Settings → Colors grades: picking Dominant against
  the current Secondary, or Secondary against the current Dominant, with a
  Light Mode score and a Dark Mode score. Use when changing the contrast
  meter, crayon swatches, grade badges, ratePaletteThemes,
  ratePaletteIfRolePicked, or color accessibility copy.
---

# Color Contrast

Read [`documentation/CONTRAST.md`](../../../documentation/CONTRAST.md) before editing the meter, tray, or palette grades. That file is the contract. Do not restate a shorter version in code comments and let this skill drift from it.

## While you change the UI

1. `ColorAccentSettings` owns prefs/theme and passes props into meter / tray / pairings molecules. Do not reintroduce `useColorPreferences` / `useTheme` on those leaves.
2. The selected role is the color being chosen. The other role stays fixed. Dominant is scored against the current Secondary. Secondary is scored against the current Dominant.
3. Keep two scores: Light Mode accessibility, and Dark Mode accessibility. Swatches are letter chips. The meter uses mode-colored boxes (stable `--color-ink-100` / `--color-ink-950`, not theme-flipping `chrome`/`black`/`white`) as full-row theme buttons with a lit/shaded bulb on the left and ratio then letter on the right — not a larger copy of `ContrastGradeBadge`. Play Preview is a mini measure grid.
4. Leave DOM and visual order as Light then Dark, always. Meter bars and swatch chips share that stack. Do not reorder with flex `order`. Chip/bar fills use stable `ink-*` tokens (`stableLightInkClassName` / `stableDarkInkClassName`) so Dark Mode cannot invert the two rows.
5. Theme: tap a bar to lock Light Mode / Dark Mode; tap again for Match System. Lit bulb = the locked row (none on System, Light row on Light, Dark row on Dark); shaded bulb when idle. Selected bars also get an inset ring.
6. After a visual change, run `bunx playwright test e2e/color-contrast.spec.ts`.
