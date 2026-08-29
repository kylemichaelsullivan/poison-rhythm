# MusiSync font assets

Poison Rhythm uses [MusiSync](https://www.fontspace.com/musisync-font-f3723) by Robert Allgeyer (SIL Open Font License 1.1) for **Notation** render mode.

Duration keys follow Allgeyer’s conventional mnemonic (`musisyncGlyphFor` in `src/lib/notation/musisync-glyphs.ts`): notes `w`/`h`/`q`/`e`/`s`, rests `H`/`W`/`Q`/`E`/`S`. Dotted values use `e.` / `q.` / dedicated `d` (dotted half), or rest + `.`. Digits are not duration glyphs.

Beamed groups (see `beam-glyphs.ts`): `n` = two eighths, `y` = four sixteenths, `m` = eighth + two sixteenths, `M` = two sixteenths + eighth, `¾` = sixteenth + eighth + sixteenth, `o` = dotted eighth + sixteenth, `§` = three eighths, `Y` = four eighths.

## Canonical source (this folder)

| File | Role |
|------|------|
| `MusiSync.woff2` | Primary (~27 KB) |
| `MusiSync.ttf` | Truetype fallback |
| `MusiSync-LICENSE.md` | OFL attribution |

**Served copies** live in [`public/fonts/`](../../../public/fonts/) so the browser loads them as static `/fonts/MusiSync.*` URLs (CSS `@font-face` in `src/index.css`). Do **not** import font files through Vite JS (`new URL` / `?url`) — that creates virtual `?import` modules and fragile hashed URLs.

When updating the font, replace files here **and** copy into `public/fonts/`.

## Refresh the woff2

Source: [OnlineWebFonts OFL mirror](https://www.onlinewebfonts.com/download/7663fd6b156c6882e4b66bd72556e0ee) of Robert Allgeyer’s MusiSync v5.002.

```bash
curl -fsSL "https://db.onlinewebfonts.com/t/7663fd6b156c6882e4b66bd72556e0ee.woff2" \
  -o src/assets/fonts/MusiSync.woff2
cp src/assets/fonts/MusiSync.woff2 public/fonts/MusiSync.woff2
```

## License

See [MusiSync-LICENSE.md](./MusiSync-LICENSE.md) for OFL attribution, commercial-use terms, and warranty disclaimers.
