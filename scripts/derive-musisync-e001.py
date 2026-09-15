#!/usr/bin/env python3
"""Derive MusiSync U+E001 (sixteenth + eighth) from stock O (16 + dotted 8).

Stock MusiSync has no precomposed [1,2] beam. Contour 0 of glyph O is the
augmentation dot; stripping it yields a conventional 16th+8th beam with
advance 1536 (so S + U+E001 fills one beat).

Requires: fonttools, brotli
  python3 -m venv .tmp-venv && .tmp-venv/bin/pip install fonttools brotli
  .tmp-venv/bin/python scripts/derive-musisync-e001.py
"""

from __future__ import annotations

from copy import deepcopy
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
from fontTools.ttLib.tables.ttProgram import Program
from fontTools.ttLib.woff2 import compress

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "src" / "assets" / "fonts" / "MusiSync.ttf"
PUBLIC = ROOT / "public" / "fonts" / "MusiSync.ttf"
GLYPH_NAME = "uniE001"
CODEPOINT = 0xE001
ADVANCE = 1536


def ensure_e001(font: TTFont) -> None:
	glyf = font["glyf"]
	hmtx = font["hmtx"]
	src = glyf["O"]
	if src.isComposite():
		raise RuntimeError("glyph O is composite; expected simple outline")

	end0 = src.endPtsOfContours[0]
	n_drop = end0 + 1
	new = deepcopy(src)
	new.coordinates = GlyphCoordinates(src.coordinates[n_drop:])
	new.flags = list(src.flags[n_drop:])
	new.endPtsOfContours = [e - n_drop for e in src.endPtsOfContours[1:]]
	new.numberOfContours = len(new.endPtsOfContours)
	new.program = Program()
	new.program.fromBytecode(b"")
	new.recalcBounds(glyf)
	glyf[GLYPH_NAME] = new

	xs = [p[0] for p in new.coordinates]
	hmtx[GLYPH_NAME] = (ADVANCE, int(min(xs)) if xs else 0)

	for table in font["cmap"].tables:
		if table.isUnicode():
			table.cmap[CODEPOINT] = GLYPH_NAME

	order = font.getGlyphOrder()
	if GLYPH_NAME not in order:
		order.append(GLYPH_NAME)
	font.setGlyphOrder(order)
	font["maxp"].numGlyphs = len(order)


def main() -> None:
	font = TTFont(str(CANONICAL))
	# Re-load stock O if E001 already present from a prior run
	if CODEPOINT in (font.getBestCmap() or {}):
		raise SystemExit(
			"U+E001 already present. Restore stock MusiSync.ttf from upstream "
			"first, then re-run this script.",
		)

	ensure_e001(font)
	for path in (CANONICAL, PUBLIC):
		font.save(str(path))
		compress(str(path), str(path.with_suffix(".woff2")))
		print(f"wrote {path} and {path.with_suffix('.woff2')}")


if __name__ == "__main__":
	main()
