# Git commits (Poison Rhythm)

Localizes the global `/git-commits` skill.

## Package manager

bun

## Quality gate

Commands (required), in order:

1. `bun run check`
2. `bun run test:all`

Loop until both exit 0. Equivalently: Biome format/lint plus Bun unit/integration plus Playwright are green. Do not commit while the gate is red.

## Docs to update

- `AGENTS.md`
- `documentation/*`
- `README.md`
- relevant `.cursor/*.mdc`
