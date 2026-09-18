# Poison Rhythm

A rhythm training game where you identify the hidden “poison” rhythm among randomly generated measures.

**Teachers:** see [`documentation/TEACHERS.md`](documentation/TEACHERS.md) for classroom start, modes, and lesson arcs.

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
| `bun run printables:student-record` | Regenerate teacher student-record PDF |
| `bun run preview` | Preview production build |

## Project Structure

```
src/
├── components/
│   ├── ui/           # Elemental atoms (Button, IconButton, Caption, Stack, Row)
│   ├── controls/     # Difficulty, play modes, New/Reuse, play/pause, carousel nav
│   ├── layout/       # Chrome, modals, ShowNotes, metronome, settings, about
│   │   ├── about/    # About modal content
│   │   ├── button/   # Footer corner triggers (Settings, Metronome, Account)
│   │   ├── metronome/
│   │   └── settings/ # SettingsOverlay + Mode / Sound / Look panels
│   ├── measures/     # Measure carousel chrome, grid, notation, playback highlighting
│   └── poison/       # Poison rhythm section layers + New/Reuse
├── contexts/         # React context modules (see Context modules below)
├── hooks/            # Playback sync, popovers, soft-disable focus, MusiSync font, …
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
| **Composers** | feature folders | Wire context + hooks (`DifficultyControls`, `MeasureSlider`, `ShowNotes`, `Body`) |
| **Hooks** | `src/hooks/` | Side effects out of JSX (`useMeasurePlaybackSync`, `useHoverPinPopover`, `useSoftDisableFocus`, `useMusiSyncFont`, `useSmoothNotationCursor`) |

Feature composers should import `@/components/ui` (or existing settings atoms) instead of inventing raw `<button className=…>` markup. Details: [`.cursor/components.mdc`](.cursor/components.mdc), [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md).

### Context modules

Context state lives under `src/contexts/`. Each module is split for Vite Fast Refresh (HMR):

- **`*Context.ts`** — context object, types, and hook (`useGame`, `useSettings`, etc.)
- **`*Provider.tsx`** — provider component only

Import from the barrel: `@/contexts`.

| Module | Hook(s) | Provider | Role |
|--------|---------|----------|------|
| `GameContext` | `useGame` | `GameProvider` | Sync-seeded round on first paint, measures, poison index, endless prefetch, visual hints |
| `SettingsContext` | `useSettings` | `SettingsProvider` | Game modes, poison/sticking, practice options (`localStorage`) |
| `PreferencesContext` | `usePreferences`, `useComplexityPreferences`, `usePlaybackPreferences`, `useDifficulty`, `useSubdivision` | `PreferencesProvider` | Complexity (difficulty, subdivision) and playback (tempo, mutes, count-in) slices |
| `MetronomeContext` | `useMetronome` | `MetronomeProvider` | Tempo, metronome/measure playback, demo-before-play passes |
| `ThemeContext` | `useTheme` | `ThemeProvider` | Light/dark/system theme |

Provider tree: `main.tsx` wraps `ThemeProvider` → `ColorPreferencesProvider` → `SettingsProvider` → `PreferencesProvider` → `MetronomeProvider`; `App.tsx` adds `GameProvider` → `AboutPoisonRhythmProvider`.

### Playback timing

Count-in and measure playback share one **audio-clock** timeline (`createPlaybackClock` + `createLookaheadScheduler` in `MetronomeProvider`):

1. Optional one-bar quarter-note count-in (Sound → Count-In Before Play)
2. First playback downbeat is exactly one quarter after the last count-in click (no wall-clock `setTimeout` gap)
3. Look-ahead schedules clicks/hits slightly ahead of `AudioContext.currentTime`
4. After each playback bar, look-ahead pauses briefly so React can sync the next measure

### Rhythm complexity

Complexity is controlled by **difficulty** and **subdivision** (not separate density/syncopation dials):

| Control | Location | Effect |
|---------|----------|--------|
| **Difficulty slider (1–5)** | Title About modal + Settings → Mode | Hit count range and placement bias (downbeats at level 1, full 16th grid at level 5) |
| **Subdivision (1/4, 1/8, 1/16)** | Header ShowNotes + Settings → Mode | Which grid positions can receive hits during generation, display, and playback |

The rhythm engine (`src/lib/rhythm/`) accepts both `difficulty` and `subdivisionLevel` when generating measures. Settings may add accents and sticking on top — but not separate density or syncopation dials.

### Settings

**UI:** `src/components/layout/settings/` (atomic rows/toggles). Main-page shortcuts (Display Mode modal, ShowNotes, metronome) stay available; difficulty + play mode live in the title About modal. Settings mirrors those adjustable prefs.

| Area | Controls |
|------|----------|
| Mode | Play mode + Endless, complexity (difficulty, subdivision), practice (Show Poison?, show next, preview pass, mute on pass) |
| Sound | Tempo, metronome mute, rhythm mute, count-in |
| Look | Theme, display mode (grid / notation), feedback, color accents (Crayola tray); see [`documentation/COLORS.md`](documentation/COLORS.md) |
| Main-page shortcuts | Poison Display Mode badge, header ShowNotes, footer metronome |

Settings modal tabs: **Mode**, **Sound**, **Look** (`SettingsTabs`).

**Persistence:**

- Theme, color accents, difficulty, tempo, subdivision, mute flags → preference keys (`poison-rhythm-*`; color via `ColorPreferencesProvider`)
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
- Playwright: seeded round ready, count-in highlight gating, count-in beats on Play, demo pass, notation overflow
- Axe: start screen (seeded round), generated round, settings (incl. Sound), metronome, modals, count-in (WCAG 2.2 A/AA + best-practice)

Details: [`documentation/TESTING.md`](documentation/TESTING.md).

## How to Play

1. On load, a **round is already generated** (no empty “Click to Generate” step). Measures and poison appear immediately.
2. Use the **difficulty slider** (1–5) to set complexity. Open the **i** help control for level details.
3. Use the header **note subdivision** control (1/4, 1/8, 1/16) to set grid density for generation, display, and playback.
4. Note the **poison rhythm** in the Poison Rhythm section (hidden when poison mode is off or set to hidden).
5. Click **New (+)** for a fresh poison and measures, or **Reuse** to keep the same poison and regenerate measures.
6. Use **Prev/Next** to step through measures and find which one matches the poison.
7. Use **Play** to hear measures (optional count-in shows beat numbers on the Play control). With **Preview Before Play** enabled (Settings → Mode), the current measure plays once as a demo (Listening), then again as the student pass (Playing; optionally muted).
8. Open the footer **metronome** to set tempo or tap tempo.
9. Open the footer **Settings** for theme, colors, sound (including tempo), complexity, play/display mode, poison visibility, and practice features (show next measure, demo pass). Difficulty + play mode are in the title **About** modal; other main-page shortcuts remain: Poison **Display Mode** badge, header ShowNotes, footer metronome.

## Documentation

- [`AGENTS.md`](AGENTS.md) — agent/contributor entrypoint (gotchas, key paths, scripts)
- [`documentation/TEACHERS.md`](documentation/TEACHERS.md) — classroom guide for music teachers
- [`documentation/COLORS.md`](documentation/COLORS.md) — color accents, Crayola tray, contrast guidance
- [`documentation/printables/student-record.pdf`](documentation/printables/student-record.pdf) — printable student practice log
- [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md) — engine, state, settings, notation, UI composition
- [`documentation/TESTING.md`](documentation/TESTING.md) — unit, integration, and Playwright guidance
- [`.cursor/skills/git-commits/SKILL.md`](.cursor/skills/git-commits/SKILL.md) — commit message conventions (`/git-commits`)
- [`src/assets/fonts/README.md`](src/assets/fonts/README.md) — MusiSync font assets and glyph keys
- [`.cursor/rules.mdc`](.cursor/rules.mdc) — project rules for Cursor
- [`.cursor/react.mdc`](.cursor/react.mdc) — React, contexts, atomic component standards
- [`.cursor/components.mdc`](.cursor/components.mdc) — component catalog and layer rules
- [`.cursor/styling.mdc`](.cursor/styling.mdc) — Tailwind and theme token usage
