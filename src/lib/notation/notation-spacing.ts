import { MEASURE_LENGTH } from '@/types';

export type NotationLayoutSlot = {
	stepIndex: number;
	/** Left edge in layout units (0–{@link MEASURE_LENGTH}). */
	x: number;
	/** Advance width in layout units. */
	width: number;
	/** Stem / accent x (center of the advance). */
	stemX: number;
};

/** Side gutter so the packed line sits centered in the measure frame. */
export const NOTATION_SIDE_PAD = 1.5;

/**
 * Relative horizontal advance for a duration. Longer values get more room,
 * but the curve is sub-linear so spacing reads like engraved music rather
 * than a piano-roll (absolute time) grid.
 */
export function relativeAdvance(durationCells: number): number {
	return Math.sqrt(Math.max(1, durationCells));
}

/**
 * Pack spelled events into a centered content band by relative duration.
 * Each event’s stem sits in the middle of its advance so the line doesn’t
 * read as left-heavy (empty duration trailing every notehead).
 */
export function layoutNotationMeasure(
	steps: ReadonlyArray<{ stepIndex: number; durationCells: number }>,
): Map<number, NotationLayoutSlot> {
	const advances = steps.map((step) => relativeAdvance(step.durationCells));
	const total = advances.reduce((sum, advance) => sum + advance, 0) || 1;
	const contentWidth = Math.max(1, MEASURE_LENGTH - 2 * NOTATION_SIDE_PAD);
	const map = new Map<number, NotationLayoutSlot>();

	// Lone whole-measure event: center it in the frame.
	if (steps.length === 1) {
		const step = steps[0];
		if (step) {
			const width = Math.min(contentWidth, MEASURE_LENGTH * 0.35);
			const x = (MEASURE_LENGTH - width) / 2;
			map.set(step.stepIndex, {
				stepIndex: step.stepIndex,
				x,
				width,
				stemX: x + width / 2,
			});
		}
		return map;
	}

	let cursor = NOTATION_SIDE_PAD;
	for (let i = 0; i < steps.length; i += 1) {
		const step = steps[i];
		const advance = advances[i];
		if (!step || advance === undefined) continue;

		const width = (advance / total) * contentWidth;
		map.set(step.stepIndex, {
			stepIndex: step.stepIndex,
			x: cursor,
			width,
			stemX: cursor + width / 2,
		});
		cursor += width;
	}

	return map;
}
