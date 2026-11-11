#!/usr/bin/env python3
"""Extract MusiSync TTF outlines into src/lib/notation/musisync-paths.ts (OFL)."""

from __future__ import annotations

import re
from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.qu2cuPen import Qu2CuPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
TTF = ROOT / "src/assets/fonts/MusiSync.ttf"
OUT = ROOT / "src/lib/notation/musisync-paths.ts"

VIEW_H = 72
STEM_TOP = 8
STEM_X = 24
NOTE_H = 1434
STEM_X_FONT = 420
SCALE = (VIEW_H - 14) / NOTE_H


def round_path(path: str) -> str:
	return re.sub(
		r"[-+]?(?:\d+\.\d+|\d+)(?:[eE][-+]?\d+)?",
		lambda m: f"{float(m.group(0)):.2f}".rstrip("0").rstrip(".")
		if "." in m.group(0)
		else m.group(0),
		path,
	)


def main() -> None:
	font = TTFont(str(TTF))
	glyf = font["glyf"]
	cmap = font.getBestCmap()

	def draw(ch: str, transform: Transform) -> str:
		g = glyf[cmap[ord(ch)]]
		svg_pen = SVGPathPen(None)
		q2c = Qu2CuPen(svg_pen, max_err=0.35, all_cubic=True)
		g.draw(TransformPen(q2c, transform), glyf)
		return round_path(svg_pen.getCommands())

	def note_transform(ch: str) -> Transform:
		g = glyf[cmap[ord(ch)]]
		if ch == "w":
			xmin, ymin, xmax, ymax = g.xMin, g.yMin, g.xMax, g.yMax
			cx, cy = (xmin + xmax) / 2, (ymin + ymax) / 2
			scale = min(28 / (xmax - xmin), 18 / (ymax - ymin))
			return Transform(scale, 0, 0, -scale, 24 - cx * scale, 50 + cy * scale)
		return Transform(
			SCALE,
			0,
			0,
			-SCALE,
			STEM_X - STEM_X_FONT * SCALE,
			STEM_TOP + g.yMax * SCALE,
		)

	def rest_transform(ch: str) -> Transform:
		g = glyf[cmap[ord(ch)]]
		xmin, ymin, xmax, ymax = g.xMin, g.yMin, g.xMax, g.yMax
		gw, gh = max(xmax - xmin, 1), max(ymax - ymin, 1)
		if ch in "QES":
			scale = min(22 / gw, 44 / gh)
			cy_target = 38
		else:
			scale = min(28 / gw, 12 / gh)
			cy_target = 42 if ch == "H" else 34
		cx, cy = (xmin + xmax) / 2, (ymin + ymax) / 2
		return Transform(
			scale, 0, 0, -scale, 22 - cx * scale, cy_target + cy * scale
		)

	def dot_transform(cx_target: float, cy_target: float, size: float = 5) -> Transform:
		g = glyf[cmap[ord(".")]]
		xmin, ymin, xmax, ymax = g.xMin, g.yMin, g.xMax, g.yMax
		cx, cy = (xmin + xmax) / 2, (ymin + ymax) / 2
		scale = size / max(xmax - xmin, ymax - ymin)
		return Transform(
			scale, 0, 0, -scale, cx_target - cx * scale, cy_target + cy * scale
		)

	paths = {
		"wholeNote": draw("w", note_transform("w")),
		"halfNote": draw("h", note_transform("h")),
		"quarterNote": draw("q", note_transform("q")),
		"eighthNote": draw("e", note_transform("e")),
		"sixteenthNote": draw("s", note_transform("s")),
		"dottedEighthNote": draw("i", note_transform("i")),
		"dottedQuarterNote": draw("j", note_transform("j")),
		"dottedHalfNote": draw("d", note_transform("d")),
		"wholeRest": draw("W", rest_transform("W")),
		"halfRest": draw("H", rest_transform("H")),
		"quarterRest": draw("Q", rest_transform("Q")),
		"eighthRest": draw("E", rest_transform("E")),
		"sixteenthRest": draw("S", rest_transform("S")),
		"augmentationDot": draw(".", dot_transform(36, 50)),
		"restAugmentationDot": draw(".", dot_transform(36, 38)),
	}

	lines = [
		"/**",
		" * MusiSync (Robert Allgeyer, OFL 1.1) outlines scaled to viewBox 0 0 48 72.",
		" * Regenerated: python scripts/extract-musisync-paths.py",
		" * Stem tip aligns to STEM_TOP_Y / STEM_X for NotationBeamLayer.",
		" */",
		"export const VIEW = { w: 48, h: 72 } as const;",
		"export const STEM_X = 24;",
		"export const STEM_TOP_Y = 8;",
		"export const HEAD_CY = 50;",
		"/** Thick engraved beam slab (MusiSync-like). */",
		"export const BEAM_THICKNESS = 5.25;",
		"export const BEAM_SECONDARY_GAP = 6.25;",
		"",
		"export const MUSISYNC_PATHS = {",
	]
	for name, path in paths.items():
		lines.append(f"\t{name}: '{path}',")
	lines += [
		"} as const;",
		"",
		"export type MusiSyncPathKey = keyof typeof MUSISYNC_PATHS;",
		"",
	]
	OUT.write_text("\n".join(lines))
	print(f"wrote {OUT}")


if __name__ == "__main__":
	main()
