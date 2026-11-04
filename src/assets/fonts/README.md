# MusiSync font assets

Poison Rhythm uses [MusiSync](https://www.fontspace.com/musisync-font-f3723) by Robert Allgeyer (SIL Open Font License 1.1) for **Notation** render mode.

Duration keys follow Allgeyer’s conventional mnemonic (`musisyncGlyphFor` in `src/lib/notation/musisync-glyphs.ts`): notes `w`/`h`/`q`/`e`/`s`, rests `W`/`H`/`Q`/`E`/`S`. Dotted notes use dedicated glyphs `i` / `j` / `d` (eighth / quarter / half); dotted rests compose rest + `.`. Digits are not duration glyphs.

Beamed groups (see `beam-glyphs.ts`): `n` = two eighths, `y` = four sixteenths, `³` = three sixteenths, U+E003 = two sixteenths (derived left half of `y`; stock MusiSync has no `[1,1]`), `m` = eighth + two sixteenths, `M` = two sixteenths + eighth, `¾` = sixteenth + eighth + sixteenth, `o` = dotted eighth + sixteenth, `O` = sixteenth + dotted eighth, U+E001 = sixteenth + eighth (derived undotted `O`; stock MusiSync has no `[1,2]`), U+E002 = eighth + sixteenth (derived undotted `o`; stock MusiSync has no `[2,1]`), `§` = three eighths, `Y` = four eighths.

## Canonical source (this folder)

| File | Role |
|------|------|
| `MusiSync.woff2` | Primary (~27 KB) |
| `MusiSync.ttf` | Truetype fallback |
| `MusiSync-LICENSE.md` | OFL attribution |

**Served copies** live in [`public/fonts/`](../../../public/fonts/) so the browser loads them as static `/fonts/MusiSync.*` URLs (CSS `@font-face` in `src/index.css` with `font-display: block`). Do **not** import font files through Vite JS (`new URL` / `?url`) — that creates virtual `?import` modules and fragile hashed URLs.

`index.html` preloads the woff2 and registers a `FontFace` before the app module runs. `prefetchMusiSyncFont` (`main.tsx`) then `document.fonts.load`s every duration and beamed glyph (`MUSISYNC_ALL_GLYPHS`) so the header ShowNotes trigger never paints fallback `q` / `e` / `s` letters.

When updating the font, replace files here **and** copy into `public/fonts/`.

### Derived beam glyphs (U+E001–U+E003)

Stock MusiSync is missing a few conventional short beams. Poison Rhythm’s copies add Private Use glyphs (each advance 1536 so a leading `S`/`E` rest fills one beat):

| Code | Source | Pattern |
|------|--------|---------|
| **U+E001** (`uniE001`) | `O` minus augmentation-dot contour | sixteenth + eighth `[1,2]` |
| **U+E002** (`uniE002`) | `o` minus augmentation-dot contour | eighth + sixteenth `[2,1]` |
| **U+E003** (`uniE003`) | `n` extend + punch `y`’s 1174–1294 beam gap | two sixteenths `[1,1]` |

After replacing the upstream TTF, restore the derived glyphs:

```bash
python3 -m venv .tmp-venv && .tmp-venv/bin/pip install fonttools brotli skia-pathops
.tmp-venv/bin/python scripts/derive-musisync-e001.py
.tmp-venv/bin/python scripts/derive-musisync-beam-extras.py
# Regenerate PUA beams only:
.tmp-venv/bin/python scripts/derive-musisync-beam-extras.py --force
```

## Refresh the woff2

Source: [OnlineWebFonts OFL mirror](https://www.onlinewebfonts.com/download/7663fd6b156c6882e4b66bd72556e0ee) of Robert Allgeyer’s MusiSync v5.002.

```bash
curl -fsSL "https://db.onlinewebfonts.com/t/7663fd6b156c6882e4b66bd72556e0ee.woff2" \
  -o src/assets/fonts/MusiSync.woff2
cp src/assets/fonts/MusiSync.woff2 public/fonts/MusiSync.woff2
```

## License

See [MusiSync-LICENSE.md](./MusiSync-LICENSE.md) for OFL attribution, commercial-use terms and warranty disclaimers.
