# Poison Rhythm

A rhythm game where you identify the hidden “poison” rhythm among randomly generated measures.

## Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling (semantic color tokens in `src/index.css`; shared surface classes in `src/lib/control-classes.ts`)
- **Biome** for linting and formatting
- **bun** for package management

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

# Run unit tests
bun run test
```

## Scripts

| Command | Description |
|----------|--------------------------------|
| `bun run dev` | Start dev server with HMR |
| `bun run build` | Type-check and build for prod |
| `bun run check` | Biome check --write (format + lint) |
| `bun run lint` | Biome lint only |
| `bun run test` | Run Bun unit tests |
| `bun run preview` | Preview production build |

## Project Structure

```
src/
├── components/
│   ├── controls/     # Difficulty, New/Reuse, play/pause, carousel nav
│   ├── layout/       # Chrome, modals, ShowNotes, metronome, settings
│   │   ├── button/   # Footer corner triggers (Settings, Metronome, Account)
│   │   ├── metronome/
│   │   └── settings/ # Settings modal body and shared setting controls
│   ├── measures/     # Measure carousel, grid, and playback highlighting
│   └── poison/       # Poison rhythm section with New/Reuse controls
├── contexts/         # Difficulty, Theme (incl. mute prefs), Metronome
├── hooks/            # usePoisonGame, metronome helpers
├── lib/              # Rhythm generation, difficulty, tempo, theme/mute prefs, control-classes
│   └── __tests__/    # Bun unit tests for lib modules
└── types/            # RhythmMeasure
```

### Settings

- UI: `src/components/layout/settings/` — theme preference chips, metronome mute, and rhythm-sound mute
- Lookups: `src/lib/theme-options.ts`, `src/lib/mute-preferences.ts`
- Persistence: theme, subdivision, and mute flags in `localStorage` via `ThemeProvider`

## Tests

Unit tests live in `__tests__/` folders next to the code they cover (currently `src/lib/__tests__/`). Run them with `bun run test`.

Covered lib modules include rhythm generation, difficulty levels, metronome tempo/tap, subdivision playback, theme options, and mute preference storage.

## How to Play

1. Use the **difficulty slider** to set complexity (1–5). Open the **i** help control for level details.
2. Note the **poison rhythm** shown in the Poison Rhythm section.
3. Click **+** to start: a new poison is chosen and measures are generated with it hidden among them.
4. Use **Prev/Next** to step through measures and find which one matches the poison.
5. Click **Reuse** to keep the same poison and regenerate measures.
6. Use **Play** to hear the current measures with a count-in; hits play a distinct rhythm sound on each subdivision step. Playback stops automatically when the poison measure finishes.
7. Open the footer **metronome** to set tempo or tap tempo.
8. Use the header **note subdivision** control to adjust display density.
9. Open the footer **Settings** to choose a light, dark, or system theme, and to mute or unmute the metronome and rhythm hit sounds.
