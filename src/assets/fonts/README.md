# MusiSync outlines (source)

Notation UI draws **SVG paths** extracted from [MusiSync](https://www.fontspace.com/musisync-font-f3723) by Robert Allgeyer (SIL Open Font License 1.1). Runtime does not load the font; glyphs live in [`src/lib/notation/musisync-paths.ts`](../../lib/notation/musisync-paths.ts).

| File | Role |
|------|------|
| `MusiSync.ttf` | Source for regenerating outlines |
| `MusiSync-LICENSE.md` | OFL attribution |

## Regenerate paths

```bash
python3 -m venv .tmp-venv && .tmp-venv/bin/pip install fonttools
.tmp-venv/bin/python scripts/extract-musisync-paths.py
```

Stem tip of stemmed notes maps to `STEM_TOP_Y` / `STEM_X` so `NotationBeamLayer` aligns.
