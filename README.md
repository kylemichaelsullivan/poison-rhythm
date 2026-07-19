# Poison Rhythm

A rhythm game where you identify the hidden “poison” rhythm among randomly generated measures.

## Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
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

## How to Play

1. Use the **difficulty slider** to set complexity (1–5). Open the **i** help control for level details.
2. Note the **poison rhythm** shown in the Poison Rhythm section.
3. Click **New** to start: a new poison is chosen and measures are generated with it hidden among them.
4. Use **Prev/Next** to step through measures and find which one matches the poison.
5. Click **Reuse** to keep the same poison and regenerate measures.
6. Use **Play** to hear the current measures with a count-in; open the footer **metronome** to set tempo or tap tempo.
7. Use the header **note subdivision** control and **theme toggle** to adjust display density and light/dark mode.
