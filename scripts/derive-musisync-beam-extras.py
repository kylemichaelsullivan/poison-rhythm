#!/usr/bin/env python3
"""Derive MusiSync PUA beams for [2,1] and [1,1].

Stock MusiSync has no precomposed eighth+sixteenth or two-sixteenths beam.

  U+E002 (uniE002): undotted `o` → eighth + sixteenth `[2,1]`
  U+E003 (uniE003): `n` extended + `y`-matched gap punch → two sixteenths `[1,1]`

  (Clipping `y` sliced stem 2. A floating secondary rect left a huge beam gap.
  Extend `n`’s beam block then punch the same 1174–1294 hole band as stock `y`.)

Advances are 1536 so a leading sixteenth/eighth rest (adv 512) fills one beat
(2048), matching U+E001 / `³`.

Requires: fonttools, brotli, skia-pathops
  python3 -m venv .tmp-venv && .tmp-venv/bin/pip install fonttools brotli skia-pathops
  .tmp-venv/bin/python scripts/derive-musisync-beam-extras.py
"""

from __future__ import annotations

import argparse
from copy import deepcopy
from pathlib import Path

import pathops
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
from fontTools.ttLib.tables.ttProgram import Program
from fontTools.ttLib.woff2 import compress

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "src" / "assets" / "fonts" / "MusiSync.ttf"
PUBLIC = ROOT / "public" / "fonts" / "MusiSync.ttf"

E002_NAME = "uniE002"
E002_CODEPOINT = 0xE002
E003_NAME = "uniE003"
E003_CODEPOINT = 0xE003
ADVANCE = 1536

# Stock `n` primary beam (two eighths)
N_BEAM_LEFT = 391
N_BEAM_RIGHT = 1260
N_PRIMARY_TOP = 1434
# Stock `y` inter-beam hole (double-beam gap)
Y_HOLE_BOTTOM = 1174
Y_HOLE_TOP = 1294
Y_HOLE_LEFT = 428
Y_HOLE_RIGHT = 1225
# Match primary beam thickness (~138) for the secondary bar below the hole
SECONDARY_THICKNESS = 138


def _empty_program() -> Program:
	program = Program()
	program.fromBytecode(b"")
	return program


def _ensure_cmap(font: TTFont, codepoint: int, glyph_name: str) -> None:
	for table in font["cmap"].tables:
		if table.isUnicode():
			table.cmap[codepoint] = glyph_name


def _ensure_glyph_order(font: TTFont, glyph_name: str) -> None:
	order = font.getGlyphOrder()
	if glyph_name not in order:
		order.append(glyph_name)
	font.setGlyphOrder(order)
	font["maxp"].numGlyphs = len(order)


def ensure_e002(font: TTFont) -> None:
	"""Eighth + sixteenth from stock `o` with augmentation-dot contour removed."""
	glyf = font["glyf"]
	hmtx = font["hmtx"]
	src = glyf["o"]
	if src.isComposite():
		raise RuntimeError("glyph o is composite; expected simple outline")

	end0 = src.endPtsOfContours[0]
	n_drop = end0 + 1
	new = deepcopy(src)
	new.coordinates = GlyphCoordinates(src.coordinates[n_drop:])
	new.flags = list(src.flags[n_drop:])
	new.endPtsOfContours = [e - n_drop for e in src.endPtsOfContours[1:]]
	new.numberOfContours = len(new.endPtsOfContours)
	new.program = _empty_program()
	new.recalcBounds(glyf)
	glyf[E002_NAME] = new

	xs = [p[0] for p in new.coordinates]
	hmtx[E002_NAME] = (ADVANCE, int(min(xs)) if xs else 0)
	_ensure_cmap(font, E002_CODEPOINT, E002_NAME)
	_ensure_glyph_order(font, E002_NAME)


def ensure_e003(font: TTFont) -> None:
	"""Two beamed sixteenths: extend `n`, punch stock-`y` gap so beams sit tight."""
	glyf = font["glyf"]
	hmtx = font["hmtx"]

	n_path = pathops.Path()
	glyf["n"].draw(n_path.getPen(), glyf)

	sec_bot = Y_HOLE_BOTTOM - SECONDARY_THICKNESS
	ext = pathops.Path()
	ext.moveTo(N_BEAM_LEFT, sec_bot)
	ext.lineTo(N_BEAM_RIGHT, sec_bot)
	ext.lineTo(N_BEAM_RIGHT, N_PRIMARY_TOP)
	ext.lineTo(N_BEAM_LEFT, N_PRIMARY_TOP)
	ext.close()
	body = pathops.simplify(pathops.op(n_path, ext, pathops.PathOp.UNION))

	hole = pathops.Path()
	hole.moveTo(Y_HOLE_LEFT, Y_HOLE_BOTTOM)
	hole.lineTo(Y_HOLE_RIGHT, Y_HOLE_BOTTOM)
	hole.lineTo(Y_HOLE_RIGHT, Y_HOLE_TOP)
	hole.lineTo(Y_HOLE_LEFT, Y_HOLE_TOP)
	hole.close()
	beamed = pathops.simplify(pathops.op(body, hole, pathops.PathOp.DIFFERENCE))

	pen = TTGlyphPen(None)
	beamed.draw(pen)
	new = pen.glyph()
	new.program = _empty_program()
	if new.numberOfContours <= 0:
		raise RuntimeError("U+E003 n extend+punch produced an empty glyph")

	glyf[E003_NAME] = new
	xs = [p[0] for p in new.coordinates]
	hmtx[E003_NAME] = (ADVANCE, int(min(xs)) if xs else 0)
	_ensure_cmap(font, E003_CODEPOINT, E003_NAME)
	_ensure_glyph_order(font, E003_NAME)


def main() -> None:
	parser = argparse.ArgumentParser(description=__doc__)
	parser.add_argument(
		"--force",
		action="store_true",
		help="Regenerate glyphs even when already present in the font.",
	)
	args = parser.parse_args()

	font = TTFont(str(CANONICAL))
	cmap = font.getBestCmap() or {}
	updated: list[str] = []

	if args.force or E002_CODEPOINT not in cmap:
		ensure_e002(font)
		updated.append("U+E002")
	if args.force or E003_CODEPOINT not in cmap:
		ensure_e003(font)
		updated.append("U+E003")

	if not updated:
		raise SystemExit(
			"U+E002 and U+E003 already present. Pass --force to regenerate, or "
			"restore stock MusiSync.ttf then re-run derive-musisync-e001.py and this script.",
		)

	for path in (CANONICAL, PUBLIC):
		font.save(str(path))
		compress(str(path), str(path.with_suffix(".woff2")))
		print(f"wrote {path} and {path.with_suffix('.woff2')} ({', '.join(updated)})")


if __name__ == "__main__":
	main()
