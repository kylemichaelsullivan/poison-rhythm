# Testing

How to run and extend tests for Poison Rhythm. See [`AGENTS.md`](../AGENTS.md) for agent gotchas and [`ARCHITECTURE.md`](ARCHITECTURE.md) for system design.

## Commands

| Command | What it runs |
|---------|----------------|
| `bun run lint` | Biome lint |
| `bun run check` | Biome check --write (format + lint) |
| `bun run ci` | Biome ci (no writes) + Bun unit/integration |
| `bun run test` | Bun tests under `src/lib/__tests__/` |
| `bun run test:unit` | Same as `test` |
| `bun run test:integration` | `src/lib/__tests__/integration/` only |
| `bun run test:e2e` | Playwright (builds + `vite preview`) |
| `bun run test:a11y` | Playwright axe suite only |
| `bun run test:all` | Biome ci + Bun + Playwright |

Use **bun**, not npm, for these scripts.

## Unit and integration (Bun)

Location: `src/lib/__tests__/`

| Area | Examples |
|------|----------|
| Preferences / settings | `preference-storage`, `settings-schema`, `settings-snapshot` |
| Playback timing | `playback-clock`, `lookahead-scheduler`, `count-in-schedule`, `playback-state` |
| Integration flow | `integration/playback-flow` — count-in → demo/student + audio-clock join |
| Rhythm engine | `rhythm/` — density, syncopation, poison, sticking |
| Notation | `notation/` — spelling, beams, dotted glyphs, ABC |
| Game modes | `game-modes/` — endless, demo audio gating |
| Audio | `audio-engine` |
| Misc | difficulty, subdivision, tempo/tap, theme, PRNG |

Conventions:

- Files: `*.test.ts`
- Import modules under test with `@/`
- Prefer pure helpers in unit tests; keep React e2e for UI contracts

## End-to-end (Playwright)

Location: `e2e/`

| Spec | Coverage |
|------|----------|
| `playback.spec.ts` | Round ready, count-in highlight gating, **count-in beats on the Play button**, post–count-in highlight, demo pass |
| `a11y.spec.ts` | axe WCAG 2.2 A/AA + best-practice (start screen, round, settings/Sound, metronome, modals, count-in) |
| `notation-scroll.spec.ts` | MusiSync boxes do not vertically overflow |
| `helpers.ts` | Shared prefs seeding and round-ready wait |

### Helpers

- **`seedPlaybackPrefs(page, { countIn, demoBeforePlay, tempo?, subdivision? })`** — `addInitScript` writes localStorage before navigation (`poison-rhythm-*` keys + `poison-rhythm-settings-v1`).
- **`generateRound(page)`** — waits for auto-seeded (or already generated) UI: `measure-slider` visible and Play enabled. Does **not** click New or EmptyStartPrompt.
- **`clickPlay` / `clickPause`** — scoped to `data-testid="play-controls"`.

### Count-in UI contract

During count-in, `PlayControls` exposes:

- `data-counting-in` when counting in
- `data-count-in-beat` — string beat number (or empty when not counting)

Assert these rather than scraping glyph text alone.

### Start screen

The a11y “start screen” test expects a **seeded** round (`measure-slider`), not an empty Generate prompt.

## Notation / font notes for tests

- Dotted note glyphs: `i` / `j` / `d` — see [`src/assets/fonts/README.md`](../src/assets/fonts/README.md)
- `[1,2]` (sixteenth + eighth) beams to derived U+E001 (undotted `O`); never alias to stock `O` (`[1,3]`)
- Lazy `MeasureNotation` + `loadMusiSyncFont` prefetch when display mode is notation (`MeasureGrid`)

## Scratch artifacts

`.tmp-glyphs/` is for local glyph screenshots only — gitignored. Do not add it to the repo or to test fixtures.
