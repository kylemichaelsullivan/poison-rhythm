# Agent Guide — Poison Rhythm

Entrypoint for people and coding agents working in this repo. Prefer this file, then linked docs, over assuming empty-start UX or inventing Settings dials for complexity.

## Stack and tooling

- **React 19** + **TypeScript** + **Vite**
- **bun** for install, scripts and unit/integration tests
- **Biome** for lint/format (`bun run lint`, `bun run check`, `bun run ci`)
- **Playwright** + **axe-core** for e2e / a11y (`bun run test:e2e`, `bun run test:a11y`)
- **Full gate**: `bun run test:all` → Biome ci + Bun tests + Playwright

Package manager is **bun**, not npm/yarn/pnpm.

## Imports

Keep **module (value) imports** and **type imports** on separate statements. Never write `import { Foo, type Bar }` or `import { type Baz, qux }`. Use a dedicated `import type { … }` line. Value imports come first; type-only imports follow (alphabetically by path).

Biome enforces this: `style/useImportType` with `style: "separatedType"` (error), and `organizeImports` groups `{ "type": false }` then `{ "type": true }`. `bun run check` / `bun run ci` fail on mixed imports. In the editor, set `js/ts.preferences.preferTypeOnlyAutoImports` so auto-imports emit `import type`.

Full order and examples: [`.cursor/rules.mdc`](.cursor/rules.mdc) (Import Organization).

## Commit messages

Follow the `/git-commits` skill and this repo’s overlay ([`.cursor/git-commits.md`](.cursor/git-commits.md)).

**Before committing:** `bun run check` → `bun run test:all` → fix until clean → update docs (`AGENTS.md`, `documentation/*`, `README.md`, relevant `.cursor/*.mdc`).

Commit subject format:

```
TYPE: Commit Message in Title Case
```

Types: `ADD`, `FIX`, `UPDATE`, `REMOVE`, `REFACTOR`, `MERGE`, `REVERT`, `BRANCH`, `DEPLOY`.

## Critical gotchas

1. **First paint already has a round.** `GameProvider` sync-seeds via `createRoundForMode` in `useState` initializer so the carousel is never empty on load. Do not write e2e or UX that waits for `title="Click to Generate a Round"` as the happy path.
2. **`EmptyStartPrompt` is fallback only.** Still rendered when `round === null`, but round is not cleared to `null` after mount in normal flow.
3. **`e2e/helpers.ts` `generateRound` does not click New.** It waits for `data-testid="measure-slider"` and an enabled Play button (auto-seeded round).
4. **Complexity is available from the title About modal and Settings → Mode** (difficulty 1–5 + subdivision). Header ShowNotes remains a quick control. Do not add Settings dials for density or syncopation as separate fields.
5. **Display mode** is on the Poison section badge (and Measures badge in Bucket mode) → one `DisplayModeModal` owned by `Body`, and also under **Settings → Mode → Display**. Badge labels are **GRID** / **NOTATION** / **SCROLL**; Scroll is a Guitar Hero–style beat-synced highway (`ScrollHighway`) with a single-press D-pad for Up / Down / Left / Right. Scroll omits Measures side gutters (prev/next, first-measure Play, last-measure menu). Rounds leave a full lookahead of decoys after poison so the highway does not empty early; Classic still stops on the poison.
6. **Play modes** are on the Difficulty section badge in the title About modal → `PlayModesModal`, and also under **Settings → Mode → Play Mode** (Classic / Bucket Drumming + Endless).
7. **Color accents are preference keys**, not the game-settings blob — `ColorPreferencesProvider` + `poison-rhythm-dominant-color` / `poison-rhythm-secondary-color` (null = brand `#914893` / `#246028`). Picking Dominant scores that color against the current Secondary, and the reverse. The meter is the grade stack with ratios; each row is also Light Mode / Dark Mode / Match System (tap to lock, tap again for Match System; lit bulb = selection: none on System, Light row on Light, Dark row on Dark). Meter bars and swatch chips use stable ink fills and stay Light-over-Dark. Read [`documentation/CONTRAST.md`](documentation/CONTRAST.md) and [`.cursor/skills/color-contrast/SKILL.md`](.cursor/skills/color-contrast/SKILL.md) before changing it.
8. **User-facing copy** uses typographic apostrophe `’` (not `'`) and no Oxford comma (`A, B and C`, not `A, B, and C`). Prefer Title Case for labels/titles; sentence case for body hints.
9. **Do not commit `.tmp-*`.** Local glyph audits, screenshots and scratch venvs; gitignored and Biome-ignored.
10. **Round logic lives in `GameProvider`.** `useGameLoop` exists but is unused by the app shell — prefer extending `GameProvider` / `@/lib/game-modes` / `@/lib/rhythm`.
11. **Difficulty slider** lives at the bottom of the title About modal (and Settings → Mode). Changing difficulty while a round is active drafts until the host modal closes; then `PendingDifficultyProvider` applies the new difficulty and regenerates the round. `DifficultyRegenAckHost` (mounted in `App`) shows a timed acknowledgement (no OK button; `TIMED_NOTICE_DURATION_MS`, default 2.5s, progress bar on the panel). Providers own state only; modal hosts sit beside the tree. iOS color and animation notes: [`documentation/IOS.md`](documentation/IOS.md).
12. **Phone-up layout** targets ≈360px (320px no horizontal overflow). Measure beat groups wrap to **2×2** below `sm`. Playwright `mobile` project (360×800) runs `a11y` + `mobile-layout` only.
13. **Escape stops playback** in `MetronomeProvider` on `keydown` (works while Play/Pause is focused); ignored in text inputs and dialogs. Space / Enter / arrows for play and tempo are also ignored while any portaled `.Modal` is open (focus may sit on `body`). The first-measure left control also cancels its own armed countdown on Escape (same ignore rules).
14. **One component per file**; composers take context/hooks, molecules take explicit props; **variants over `className`** (`tone`, `size`, `framed`, `slot`). Shared modal chrome: `ModalScrim` / `ModalPanel` / `ModalCloseButton` / `ModalTitle` + `useModalFocusTrap`. **`Modal` portals to `document.body`** so nested dialogs (Difficulty Help / Play Modes inside About or Settings) are not clipped by a parent panel’s `overflow` / `backdrop-filter`. `useModalFocusTrap` only handles Escape/Tab for the topmost `.Modal`. Measure leaves take `display` from `useMeasureDisplayOptions` (wired in `MeasuresSection` / `PoisonMeasureContent`). Settings → Colors: `ColorAccentSettings` owns prefs + theme; meter / tray / pairings / score rows are prop-driven (`CrayonTray` memoizes grades on role + partner so theme taps do not rescore). Prefer `useSetting` / `usePaletteContrast` / `useColorRoleSelection` over ad-hoc wiring; reusable atoms stay props-only (`MuteToggle`, `EnableToggle`, `CrayonSwatch`, `ThemeScoreRow`).
15. **Button hover / focus** is global in `src/index.css` (`button` + `.InteractiveInsetChrome`): inset complement ring + lift. Do not change fill or ink. Keep each control’s shape (`rounded-full`, `rounded-lg`, …). Exceptions: `ModalScrim`, intro step dots (quiet marker hover). Native `:hover` / `:focus` (tablets). Paint range rails only on `::-webkit-slider-runnable-track` / `::-moz-range-track`. Light/dark paints are `@theme` tokens (`--theme-dark-*`); `:root` apply blocks rebind names — do not add per-component `prefers-color-scheme` / `[data-theme]` color rules.
16. **Carousel ends are not empty gutters** (Grid / Notation). First measure: `CarouselStartPlayButton` is an empty box at rest (no layout shift) and starts Play after `CAROUSEL_PLAY_DELAY_MS` (click again, outside or Escape to cancel). Last measure: `CarouselEndMenu` offers New / Reuse / Play. Measures tab order is Eye, Volume, Previous Measure, Next Measure — section children render before the gutter controls in `CarouselNavButtons`. Scroll passes `showSideNav={false}`. Metronome ± stay in-flow beside the tempo surface — do not collapse them with `max-gutter` (the modal is never that wide).
17. **First-visit welcome** (`IntroModalHost` in `App`, state in `IntroTutorialProvider`) is a three-step Simon Says tutorial on **quarter notes** (ignores ShowNotes). Every step shows the labeled **Poison Rhythm** and a centered **Don’t show again** (`IconToggle` checkbox chip with `InteractiveInsetChrome`, **on by default**). Step dots jump to that slide (quiet `--shadow-control` on the marker; small Dominant ring on keyboard focus). Steps 1–2 are safe measures (`Simon says: “Play this”`). Step 3 is the matching poison with `“Play this”`; after 1s **That’s the Poison** overlays the measure, then **You lose!** 1s later, then **Let’s Play** gets a Secondary `IntroPlayHalo` (`INTRO_PLAY_HALO_AFTER_MS`; nav side cells keep `p-2.5` so the ring is not clipped by the modal body’s overflow). Arrow Left/Right move steps; on the last step Arrow Right dismisses only after the halo starts. Enter/Space always activate the focused Next / Let’s Play CTA (not gated on the halo). Replay from **Settings → Mode → Welcome Tutorial**. Dismissing with **Don’t show again** checked writes `poison-rhythm-intro-seen`. Uncheck it first to hide the welcome for this visit only. Playwright’s default `storageState` already sets the key; first-visit specs use `FIRST_VISIT_STORAGE_STATE`.

## Key paths

| Path | Role |
|------|------|
| `src/contexts/GameProvider.tsx` | Sync-seeded round, New/Reuse, endless append |
| `src/contexts/PendingDifficultyProvider.tsx` | Draft difficulty + regen; state only (no modal JSX) |
| `src/contexts/MetronomeProvider.tsx` | Audio clock + `useMetronome` / `useMetronomeTempo` split; count-in, demo/student passes, Escape-to-stop |
| `src/components/controls/DifficultyRegenAckHost.tsx` | App-level host for the timed post-regen acknowledgement |
| `src/components/layout/about/AboutPoisonRhythmModal.tsx` | App-level host for title About + `DifficultyControls` |
| `src/components/layout/intro/IntroModalHost.tsx` | App-level host for the first-visit welcome (`poison-rhythm-intro-seen`) |
| `src/components/layout/Modal.tsx` | Modal composer; portals to `document.body`; chrome atoms + `useModalFocusTrap` |
| `src/components/layout/settings/` | Settings modal (`SettingsOverlay` → Mode / Sound / Colors) |
| `src/components/controls/PlayControls.tsx` | Play/Pause; `data-count-in-beat` during count-in |
| `src/components/controls/VolumeMenu.tsx` | Measures speaker popover: Metronome / Playback / Preview mutes; click while open mutes all, click again restores or unmutes all |
| `src/components/controls/CarouselStartPlayButton.tsx` | First-measure delayed Play; empty at rest |
| `src/components/controls/CarouselEndMenu.tsx` | Last-measure New / Reuse / Play |
| `src/components/measures/MeasureGrid.tsx` | Mode switch + Suspense; prop-driven `display`; grid via `MeasureCellGrid`; prefetch via `useNotationPrefetch` |
| `src/hooks/useMeasureDisplayOptions.ts` | Derive measure chrome flags once for section composers |
| `src/components/layout/settings/colors/ColorAccentSettings.tsx` | Colors tab composer; owns prefs + role/contrast hooks; meter owns theme; tray memoized |
| `src/components/measures/measure-phase-chrome.ts` | Live-measure shell/hit classes by `data-playback-phase` (idle / count-in / listening / playing) |
| `src/components/measures/MeasureCarouselChrome.tsx` | Carousel chrome; `live` sets `data-testid="measure-slider"` |
| `src/hooks/useDisclosure.ts` | Shared open/close state for modals |
| `src/hooks/useNotationPrefetch.ts` | Prefetch notation chunk + MusiSync when mode is notation |
| `src/hooks/useSubdivisionProgress.ts` | Fractional subdivision step (RAF) for notation playhead consumers |
| `src/hooks/useActiveNotationStepIndex.ts` | Cell-map lookup → active MusiSync glyph during playback |
| `src/lib/rhythm/` | Measure/round generation |
| `src/lib/notation/` | Events → spelling → beams → MusiSync glyphs |
| `src/lib/notation/notation-playback.ts` | Length-16 cell→glyph map for duration-accurate active token |
| `src/lib/notation/musisync-glyphs.ts` | Duration glyph map (`i`/`j`/`d` dotted notes) |
| `src/lib/notation/beam-glyphs.ts` | Beamed patterns (`³`, `O`, `o`, U+E001–E003 for `[1,2]`/`[2,1]`/`[1,1]`, `n`, `y`, …) |
| `src/lib/control-classes.ts` | Shared control classes; global button hover tokens / carousel nav / side-gutter helpers; `SegmentControlVariant` includes `'header'` |
| `src/lib/hierarchy-border.ts` | Shared border ranks (active / emphasis / structure / provisional) for swatches + measures |
| `src/lib/colors/contrast.ts` | WCAG ratios mapped to US letter grades A/B/C/F for crayon / pair rating |
| `src/types/rhythm.ts` | `RhythmMeasure` / `RichRhythmMeasure` + adapters |
| `e2e/helpers.ts` | Pref seeding + round-ready wait |
| `biome.json` | Lint/format; `useImportType` `separatedType` + type-import grouping |
| `documentation/ARCHITECTURE.md` | Engine, state, UI layers |
| `documentation/TESTING.md` | Test layout, commands, e2e notes |
| `.cursor/git-commits.md` | Commit overlay for `/git-commits` (gate + docs) |
| `src/assets/fonts/README.md` | MusiSync assets and glyph keys |
| `.cursor/*.mdc` | Cursor rules (components, React, styling, project) |

## Documentation map

| Doc | Audience |
|-----|----------|
| [`README.md`](README.md) | Humans: setup, play, structure |
| [`documentation/TEACHERS.md`](documentation/TEACHERS.md) | Music teachers: classroom arcs and settings |
| [`documentation/COLORS.md`](documentation/COLORS.md) | Color prefs, Crayola tray, contrast grades |
| [`documentation/CONTRAST.md`](documentation/CONTRAST.md) | Which role is scored, Light/Dark stack order |
| [`documentation/A11Y.md`](documentation/A11Y.md) | Contrast grades, border hierarchy, keyboard / a11y |
| [`documentation/IOS.md`](documentation/IOS.md) | iOS WebKit color, gradient and animation quirks |
| [`documentation/printables/student-record.pdf`](documentation/printables/student-record.pdf) | Printable student practice log (regen: `bun run printables:student-record`) |
| [`AGENTS.md`](AGENTS.md) | Agents + contributors: gotchas and pointers |
| [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md) | System design |
| [`documentation/TESTING.md`](documentation/TESTING.md) | How to run and extend tests |
| [`/git-commits`](.cursor/git-commits.md) | Commit conventions + pre-commit gate |
| [`src/assets/fonts/README.md`](src/assets/fonts/README.md) | Notation font |
| [`.cursor/rules.mdc`](.cursor/rules.mdc) | Always-on project rules |
| [`.cursor/react.mdc`](.cursor/react.mdc) | React / contexts / domain |
| [`.cursor/components.mdc`](.cursor/components.mdc) | UI layer catalog |
| [`.cursor/styling.mdc`](.cursor/styling.mdc) | Tailwind / theme tokens |

## Quick verify

```bash
bun run test:all
```
