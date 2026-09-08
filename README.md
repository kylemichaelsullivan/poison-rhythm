# Poison Rhythm

A rhythm training game where you identify the hidden “poison” rhythm among randomly generated measures.

## Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling (semantic color tokens in `src/index.css`; shared surface classes in `src/lib/control-classes.ts`)
- **Biome** for linting and formatting (recommended VS Code extension: `biomejs.biome`)
- **Zod** for settings and preference validation
- **bun** for package management and unit/integration tests
- **Playwright** + **axe-core** for e2e and accessibility tests

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint (Biome)
bun run lint

# Format + lint with writes
bun run check

# CI-style lint (no writes) + unit/integration tests
bun run ci

# Run unit + integration tests
bun run test

# Run Playwright e2e tests (builds + previews production)
bun run test:e2e

# Run axe accessibility suite only
bun run test:a11y

# Lint + unit/integration + e2e
bun run test:all
```

## Scripts

| Command | Description |
|----------|--------------------------------|
| `bun run dev` | Start dev server with HMR |
| `bun run build` | Type-check and build for prod |
| `bun run format` | Biome format --write |
| `bun run lint` | Biome lint only |
| `bun run check` | Biome check --write (format + lint) |
| `bun run ci` | Biome ci (no writes) + Bun tests |
| `bun run test` | Bun unit + integration tests |
| `bun run test:unit` | Same as `test` (lib suites under `src/lib/__tests__`) |
| `bun run test:integration` | Bun integration suites only |
| `bun run test:e2e` | Playwright e2e (incl. playback) |
| `bun run test:a11y` | Playwright axe a11y suite |
| `bun run test:all` | Biome ci, Bun tests, then Playwright |
| `bun run preview` | Preview production build |

## Project Structure

```
src/
├── components/
│   ├── ui/           # Elemental atoms (Button, IconButton, Caption, Stack, Row)
│   ├── controls/     # Difficulty, play modes, New/Reuse, play/pause, carousel nav
│   ├── layout/       # Chrome, modals, ShowNotes, metronome, settings
│   │   ├── button/   # Footer corner triggers (Settings, Metronome, Account)
│   │   ├── metronome/
│   │   └── settings/ # Settings panels and shared setting atoms
│   ├── measures/     # Measure carousel chrome, grid, playback highlighting
│   └── poison/       # Poison rhythm section layers + New/Reuse
├── contexts/         # React context modules (see Context modules below)
├── hooks/            # Playback sync, popovers, soft-disable focus, game loop, …
├── lib/
│   ├── audio/        # Web Audio scheduling, feedback gating
│   ├── game-modes/   # default, bucket trainer (+ endless stream)
│   ├── notation/     # MusiSync glyph pipeline (events → beaming → display)
│   ├── rhythm/       # Modular rhythm generation engine
│   ├── playback-clock.ts / lookahead-scheduler.ts  # Count-in → playback audio clock
│   ├── __tests__/    # Bun unit + integration tests
│   ├── settings-schema.ts
│   ├── preference-schemas.ts
│   ├── preference-storage.ts
│   └── …             # difficulty, tempo, subdivision playback, theme, storage
├── assets/
│   └── fonts/        # MusiSync canonical copies (served from public/fonts/)
└── types/            # RhythmMeasure, RichRhythmMeasure, Round, GameState
e2e/                  # Playwright e2e + axe a11y specs
```

### Component layers

UI is composed like stacked layers (one concern per file; prefer one root DOM element):

| Layer | Location | Role |
|-------|----------|------|
| **Atoms** | `src/components/ui/` | Single-element primitives (`Button`, `IconButton`, `Caption`, `Stack`, `Row`) |
| **Molecules** | `controls/`, `measures/`, `layout/settings/` | Composed pieces (`PlayModeOptionCard`, `MeasureCarouselChrome`, `EnableToggle`) |
| **Composers** | feature folders | Wire context + hooks (`GameControls`, `MeasureSlider`, `ShowNotes`, `Body`) |
| **Hooks** | `src/hooks/` | Side effects out of JSX (`usePendingDifficulty`, `useMeasurePlaybackSync`, `useHoverPinPopover`, `useSoftDisableFocus`, `useMusiSyncFont`, `useSmoothNotationCursor`) |

Feature composers should import `@/components/ui` (or existing settings atoms) instead of inventing raw `<button className=…>` markup. Details: [`.cursor/components.mdc`](.cursor/components.mdc), [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md).

### Context modules

Context state lives under `src/contexts/`. Each module is split for Vite Fast Refresh (HMR):

- **`*Context.ts`** — context object, types, and hook (`useGame`, `useSettings`, etc.)
- **`*Provider.tsx`** — provider component only

Import from the barrel: `@/contexts`.

| Module | Hook(s) | Provider | Role |
|--------|---------|----------|------|
| `GameContext` | `useGame` | `GameProvider` | Round state, measures, poison index, endless prefetch, visual hints |
| `SettingsContext` | `useSettings` | `SettingsProvider` | Game modes, poison/sticking, practice options (`localStorage`) |
| `PreferencesContext` | `usePreferences`, `useDifficulty` | `PreferencesProvider` | Difficulty, tempo, subdivision, mute/count-in prefs |
| `MetronomeContext` | `useMetronome` | `MetronomeProvider` | Tempo, metronome/measure playback, demo-before-play passes |
| `ThemeContext` | `useTheme` | `ThemeProvider` | Light/dark/system theme |

Provider tree: `main.tsx` wraps `ThemeProvider` → `SettingsProvider` → `PreferencesProvider` → `MetronomeProvider`; `App.tsx` adds `GameProvider`.

### Playback timing

Count-in and measure playback share one **audio-clock** timeline (`createPlaybackClock` + `createLookaheadScheduler` in `MetronomeProvider`):

1. Optional one-bar quarter-note count-in (Sound → Count-In Before Play)
2. First playback downbeat is exactly one quarter after the last count-in click (no wall-clock `setTimeout` gap)
3. Look-ahead schedules clicks/hits slightly ahead of `AudioContext.currentTime`
4. After each playback bar, look-ahead pauses briefly so React can sync the next measure

### Rhythm complexity

Complexity is controlled by **two existing main-page controls** — not duplicated in Settings:

| Control | Location | Effect |
|---------|----------|--------|
| **Difficulty slider (1–5)** | Main page | Hit count range and placement bias (downbeats at level 1, full 16th grid at level 5) |
| **Subdivision (1/4, 1/8, 1/16)** | Header ShowNotes | Which grid positions can receive hits during generation, display, and playback |

The rhythm engine (`src/lib/rhythm/`) accepts both `difficulty` and `subdivisionLevel` when generating measures. Settings may add accents and sticking on top — but not separate density, syncopation, or subdivision dials.

### Settings

**UI:** `src/components/layout/settings/` (atomic rows/toggles) plus main-page **Play Modes** modal in `src/components/controls/`

| Area | Controls |
|------|----------|
| Mode | Practice toggles; accents & sticking (Coming Soon) |
| Appearance | Theme, feedback (visual / audio toggles) |
| Sound | Metronome mute, rhythm mute, count-in |
| Display Mode (Poison section) | Grid / notation; scroll (Coming Soon) |
| Play modes (main page) | Classic, Bucket Drumming; **Endless** checkbox |
| Poison visibility | Eye toggle on Poison Rhythm — hide during playback vs always show |

Settings modal tabs: **Mode**, **Sound**, **Appearance** (`SettingsTabs`). Display mode is **not** in Settings — use the badge on the Poison Rhythm section.

**Persistence:**

- Theme, difficulty, tempo, subdivision, mute flags → `PreferencesProvider` (`poison-rhythm-*` keys)
- Game settings → `SettingsProvider` (`poison-rhythm-settings-v1`)
- Schemas: `src/lib/preference-schemas.ts`, `src/lib/settings-schema.ts`

### Game modes

| Mode | Behavior |
|------|----------|
| **default** (Classic) | Poison among measures; playback stops at poison unless Endless is on |
| **bucketTrainer** | Poison off; Endless forced on; sticking locked by difficulty |

Hide-during-playback (“memory”) is the Poison Rhythm Eye toggle (`poisonMode: hidden`), not a separate play mode.

**Endless** is a separate settings checkbox (not its own `gameMode`). Mode logic: `src/lib/game-modes/`. Round creation and prefetch: `GameProvider`.

### Rhythm generation

```
generateMeasure({ difficulty, subdivisionLevel, settings, seed }) → RichRhythmMeasure
generateRound({ difficulty, subdivisionLevel, settings, seed? }) → Round
```

Modules under `src/lib/rhythm/`:

- `grid.ts` — allowed indices per subdivision level
- `density.ts` — hit count from difficulty
- `syncopation.ts` — placement bias from difficulty
- `accents-rests.ts`, `sticking.ts`, `poison.ts`, `phrase.ts`
- `prng.ts` — seeded generation for reproducibility
- `generate-measure.ts`, `generate-round.ts` — orchestrators

`RhythmMeasure` is the hit/rest `boolean[]` grid (piano-roll / playback). `RichRhythmMeasure` (`RhythmStep[]`) adds accent and sticking for generation and notation. Adapters live in `src/types/rhythm.ts`.

### Notation display

When display mode is **notation**, measures render as [MusiSync](https://www.fontspace.com/musisync-font-f3723) font glyphs:

```
measure → notation events → duration spelling → beaming → MusiSync string → MeasureNotation
```

Pipeline modules live in `src/lib/notation/`. Font files: `src/assets/fonts/` (canonical) and `public/fonts/` (served). Glyph keys and refresh steps: [`src/assets/fonts/README.md`](src/assets/fonts/README.md).

## Tests

| Suite | Location | Runner |
|-------|----------|--------|
| Unit | `src/lib/__tests__/` (incl. `rhythm/`, `game-modes/`, notation) | `bun run test` |
| Integration | `src/lib/__tests__/integration/` | `bun run test:integration` |
| E2E | `e2e/*.spec.ts` (shared helpers in `e2e/helpers.ts`) | `bun run test:e2e` |
| A11y | `e2e/a11y.spec.ts` (axe-core) | `bun run test:a11y` |

Coverage includes:

- Settings schema validation and serialization
- PRNG determinism
- Rhythm generation (hit count, placement, sticking, poison)
- Notation (duration spelling, beaming, MusiSync glyph mapping)
- Game modes (endless prefetch, demo playback audio gating)
- Playback clock / look-ahead (count-in → playback join with no timer gap)
- Difficulty levels, subdivision playback, metronome tempo/tap
- Theme options and preference storage
- Playwright: generate round, count-in highlight gating, demo pass, notation overflow
- Axe: empty start, generated round, settings (incl. Sound), metronome, modals, count-in (WCAG 2 A/AA + best-practice)

## How to Play

1. Use the **difficulty slider** (1–5) to set complexity. Open the **i** help control for level details.
2. Use the header **note subdivision** control (1/4, 1/8, 1/16) to set grid density for generation, display, and playback.
3. Note the **poison rhythm** in the Poison Rhythm section (hidden when poison mode is off or set to hidden).
4. Click **+** to start: a new poison is chosen and measures are generated with it hidden among them.
5. Use **Prev/Next** to step through measures and find which one matches the poison.
6. Click **Reuse** to keep the same poison and regenerate measures.
7. Use **Play** to hear measures with a count-in. With **Preview Before Play** enabled (Settings → Mode), the current measure plays once as a demo (Listening), then again as the student pass (Playing; optionally muted).
8. Open the footer **metronome** to set tempo or tap tempo.
9. Open the footer **Settings** for theme, sound mutes, practice features (show next measure, demo pass), and upcoming rhythm options (accents, sticking). Change **play mode** from the mode badge on the Difficulty section. Change **display mode** (grid / notation; scroll Coming Soon) from the badge on the Poison Rhythm section.

## Documentation

- [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md) — engine, state, settings, notation, UI composition
- [`documentation/GIT_COMMITS.md`](documentation/GIT_COMMITS.md) — commit message conventions
- [`src/assets/fonts/README.md`](src/assets/fonts/README.md) — MusiSync font assets and glyph keys
- [`.cursor/rules.mdc`](.cursor/rules.mdc) — project rules for Cursor
- [`.cursor/react.mdc`](.cursor/react.mdc) — React, contexts, atomic component standards
- [`.cursor/components.mdc`](.cursor/components.mdc) — component catalog and layer rules
- [`.cursor/styling.mdc`](.cursor/styling.mdc) — Tailwind and theme token usage
