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
| Misc | difficulty, subdivision, tempo/tap, theme, PRNG, timed-notice (duration, iOS-safe progress colors), status-toast transitions (mute coalesce) |

Conventions:

- Files: `*.test.ts`
- Import modules under test with `@/`
- Keep value imports and `import type` on separate statements (same as app code; Biome `separatedType`)
- Prefer pure helpers in unit tests; keep React e2e for UI contracts

## End-to-end (Playwright)

Location: `e2e/`

| Spec | Coverage |
|------|----------|
| `playback.spec.ts` | Round ready, count-in highlight gating, **count-in beats on the Play button**, post–count-in highlight, demo pass, **Escape stops playback** (including while Play/Pause is focused), **Measures tab order** (Show Next Measure, Listen Before You Play, Volume, Previous Measure, Next Measure), **Practice toggles** (eye / ear), **Volume menu Preview-only mute confirm** (Cancel / Mute Preview / Mute Both), **speaker mutes all while the menu is open**, **speaker restores the previous mix or unmutes all**, **Playback unmute restores Preview when both were muted**, **first-measure delayed Play** (cancel via click / outside), **last-measure New / Reuse / Play** |
| `scroll-highway.spec.ts` | Highway progress during count-in + playback; Scroll always counts in; Settings hides Practice + Sound Preview/Count-In; poison shows notation and grid |
| `poison-hit.spec.ts` | Classic bottle under “That’s the Poison!” explodes then auto-clears; Endless continuous play never shows it |
| `difficulty-regen-ack.spec.ts` | Difficulty acknowledgement and Account notice: **no OK button**, `0.5rem` theme progress bar, dismiss on `TIMED_NOTICE_DURATION_MS`, **pause while hovered**. Account copy uses `text-wrap: pretty` (no non-breaking spaces) |
| `status-toast.spec.ts` | Lower-right status toast for screen UI toggles (`data-testid="status-toast"`); Settings → Mode practice toggles stay silent |
| `a11y.spec.ts` | axe WCAG 2.2 A/AA + best-practice (start screen, round, settings/Sound, metronome, modals, count-in). Runs on **Desktop Chrome** and **mobile** (360×800) projects |
| `mobile-layout.spec.ts` | 360×800 smoke: first-measure delayed Play + Next vs Play overlap, last-measure end menu, 2-col measure grid, Settings panel scroll |
| `color-contrast.spec.ts` | Colors meter matches swatch chips plus ratios; Light on top in every theme; Dominant is scored against Secondary and the reverse |
| `notation-scroll.spec.ts` | SVG notation boxes do not vertically overflow |
| `shownotes-glyph.spec.ts` | Header note indicator paints an SVG note glyph in Light, Dark and System |
| `intro.spec.ts` | First-visit Simon Says tutorial (two safe bars, then timed poison fail overlays); nav dots jump to a step; Arrow Left/Right move steps; Enter closes on Let’s Play before the halo; Arrow Right closes only after the halo; **Don’t show again** is checked by default so Let’s Play persists; uncheck it for session-only dismiss; returning visits skip it unless **Settings → Mode → Welcome Tutorial** |
| `helpers.ts` | Shared prefs seeding and round-ready wait |

### Playwright projects

| Project | Viewport | Specs |
|---------|----------|--------|
| `chromium` | Desktop Chrome | All `e2e/` except `mobile-layout.spec.ts`. Default `storageState` marks the welcome as seen (`poison-rhythm-intro-seen`) |
| `mobile` | 360×800 (Pixel 5 UA) | `a11y.spec.ts`, `mobile-layout.spec.ts` only |

### Helpers

- **`seedPlaybackPrefs(page, { countIn, demoBeforePlay, tempo?, subdivision? })`** — `addInitScript` writes localStorage before navigation (`poison-rhythm-*` keys + `poison-rhythm-settings-v1`).
- **`FIRST_VISIT_STORAGE_STATE`** — empty Playwright storage so the welcome can open (`intro.spec.ts`, a11y welcome case). Default config `storageState` already sets `poison-rhythm-intro-seen`.
- **`generateRound(page)`** — waits for auto-seeded (or already generated) UI: `measure-slider` visible and Play enabled. Does **not** click New or EmptyStartPrompt.
- **`clickPlay` / `clickPause`** — scoped to `data-testid="play-controls"`.

### Count-in UI contract

During count-in, `PlayControls` exposes:

- `data-counting-in` when counting in
- `data-count-in-beat` — string beat number (or empty when not counting)

Assert these rather than scraping glyph text alone.

### Keyboard stop

`MetronomeProvider` stops playback on **Escape** via `keydown` so it still works when focus is on Play/Pause (or other controls). Escape is ignored inside text inputs and `[role="dialog"]`.

### Start screen

The a11y “start screen” test expects a **seeded** round (`measure-slider`), not an empty Generate prompt.

## Notation notes for tests

- One `NotationStep` per spelled event; beamed notes share `beamGroupId` and highlight independently
- Beam geometry: primary spans the group; secondary covers contiguous sixteenths with partials for mixed `[2,1]` / `[1,2]`
- Lazy `MeasureNotation` chunk prefetch when display mode is notation (`MeasureGrid` → `useNotationPrefetch`; loading shell is `NotationFallback`)
- Header ShowNotes trigger: `e2e/shownotes-glyph.spec.ts` asserts an SVG note glyph is present in Light, Dark and System

## Scratch artifacts

`.tmp-*` (glyph audits, screenshots, scratch venvs) is local only — gitignored and Biome-ignored. Do not add it to the repo or to test fixtures.
