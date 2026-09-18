# Agent Guide — Poison Rhythm

Entrypoint for people and coding agents working in this repo. Prefer this file, then linked docs, over assuming empty-start UX or inventing Settings dials for complexity.

## Stack and tooling

- **React 19** + **TypeScript** + **Vite**
- **bun** for install, scripts, and unit/integration tests
- **Biome** for lint/format (`bun run lint`, `bun run check`, `bun run ci`)
- **Playwright** + **axe-core** for e2e / a11y (`bun run test:e2e`, `bun run test:a11y`)
- **Full gate**: `bun run test:all` → Biome ci + Bun tests + Playwright

Package manager is **bun**, not npm/yarn/pnpm.

## Commit messages

Follow the `/git-commits` skill ([`.cursor/skills/git-commits/SKILL.md`](.cursor/skills/git-commits/SKILL.md)):

```
TYPE: Commit Message in Title Case
```

Types: `ADD`, `FIX`, `UPDATE`, `REMOVE`, `REFACTOR`, `MERGE`, `REVERT`, `BRANCH`, `DEPLOY`.

## Critical gotchas

1. **First paint already has a round.** `GameProvider` sync-seeds via `createRoundForMode` in `useState` initializer so the carousel is never empty on load. Do not write e2e or UX that waits for `title="Click to Generate"` as the happy path.
2. **`EmptyStartPrompt` is fallback only.** Still rendered when `round === null`, but round is not cleared to `null` after mount in normal flow.
3. **`e2e/helpers.ts` `generateRound` does not click New.** It waits for `data-testid="measure-slider"` and an enabled Play button (auto-seeded round).
4. **Complexity is available from the title About modal and Settings → Mode** (difficulty 1–5 + subdivision). Header ShowNotes remains a quick control. Do not add Settings dials for density or syncopation as separate fields.
5. **Display mode** is on the Poison section badge → `DisplayModeModal`, and also under **Settings → Look → Display**.
6. **Play modes** are on the Difficulty section badge in the title About modal → `PlayModesModal`, and also under **Settings → Mode → Play Mode** (Classic / Bucket Drumming + Endless).
7. **Color accents are preference keys**, not the game-settings blob — `ColorPreferencesProvider` + `poison-rhythm-dominant-color` / `poison-rhythm-secondary-color` (null = brand). See [`documentation/COLORS.md`](documentation/COLORS.md).
8. **User-facing copy** uses typographic apostrophe `’` (not `'`). Prefer Title Case for labels/titles; sentence case for body hints.
9. **Do not commit `.tmp-glyphs/`.** Local glyph audit screenshots; gitignored and Biome-ignored.
10. **Round logic lives in `GameProvider`.** `useGameLoop` exists but is unused by the app shell — prefer extending `GameProvider` / `@/lib/game-modes` / `@/lib/rhythm`.
11. **Difficulty slider** lives at the bottom of the title About modal (and Settings → Mode). Regenerate confirm (`ConfirmRegenModal`) only appears after that host modal closes, and only if difficulty changed from the committed value while a round is active (`PendingDifficultyProvider`).

## Key paths

| Path | Role |
|------|------|
| `src/contexts/GameProvider.tsx` | Sync-seeded round, New/Reuse, endless append |
| `src/contexts/MetronomeProvider.tsx` | Audio clock, count-in, demo/student passes, `countInBeat` |
| `src/components/layout/settings/` | Settings modal (`SettingsOverlay` → Mode / Sound / Look) |
| `src/components/controls/PlayControls.tsx` | Play/Pause; `data-count-in-beat` during count-in |
| `src/components/measures/MeasureGrid.tsx` | Grid vs lazy notation; prefetches chunk + MusiSync font |
| `src/lib/rhythm/` | Measure/round generation |
| `src/lib/notation/` | Events → spelling → beams → MusiSync glyphs |
| `src/lib/notation/musisync-glyphs.ts` | Duration glyph map (`i`/`j`/`d` dotted notes) |
| `src/lib/notation/beam-glyphs.ts` | Beamed patterns (`³`, `O`, `o`, U+E001 for `[1,2]`, `n`, `y`, …) |
| `src/lib/control-classes.ts` | Shared control classes; `SegmentControlVariant` includes `'header'` |
| `src/types/rhythm.ts` | `RhythmMeasure` / `RichRhythmMeasure` + adapters |
| `e2e/helpers.ts` | Pref seeding + round-ready wait |
| `documentation/ARCHITECTURE.md` | Engine, state, UI layers |
| `documentation/TESTING.md` | Test layout, commands, e2e notes |
| `.cursor/skills/git-commits/` | Commit format (`/git-commits`) |
| `src/assets/fonts/README.md` | MusiSync assets and glyph keys |
| `.cursor/*.mdc` | Cursor rules (components, React, styling, project) |

## Documentation map

| Doc | Audience |
|-----|----------|
| [`README.md`](README.md) | Humans: setup, play, structure |
| [`documentation/TEACHERS.md`](documentation/TEACHERS.md) | Music teachers: classroom arcs and settings |
| [`documentation/COLORS.md`](documentation/COLORS.md) | Color prefs, Crayola tray, contrast guidance |
| [`documentation/printables/student-record.pdf`](documentation/printables/student-record.pdf) | Printable student practice log (regen: `bun run printables:student-record`) |
| [`AGENTS.md`](AGENTS.md) | Agents + contributors: gotchas and pointers |
| [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md) | System design |
| [`documentation/TESTING.md`](documentation/TESTING.md) | How to run and extend tests |
| [`/git-commits`](.cursor/skills/git-commits/SKILL.md) | Commit conventions |
| [`src/assets/fonts/README.md`](src/assets/fonts/README.md) | Notation font |
| [`.cursor/rules.mdc`](.cursor/rules.mdc) | Always-on project rules |
| [`.cursor/react.mdc`](.cursor/react.mdc) | React / contexts / domain |
| [`.cursor/components.mdc`](.cursor/components.mdc) | UI layer catalog |
| [`.cursor/styling.mdc`](.cursor/styling.mdc) | Tailwind / theme tokens |

## Quick verify

```bash
bun run test:all
```
