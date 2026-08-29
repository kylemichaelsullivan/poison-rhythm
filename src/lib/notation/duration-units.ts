import { MEASURE_LENGTH } from '@/types';
import type { NotationDuration } from './musisync-glyphs';

/** Sixteenth-cells per quarter beat in 4/4. */
export const CELLS_PER_BEAT = 4;

/** Mid-bar boundary (start of beat 3) in 4/4. */
export const HALF_BAR_CELL = 8;

const CELLS_BY_DURATION: Record<NotationDuration, number> = {
	sixteenth: 1,
	eighth: 2,
	dottedEighth: 3,
	quarter: 4,
	dottedQuarter: 6,
	half: 8,
	dottedHalf: 12,
	whole: 16,
};

const DURATION_BY_CELLS: Partial<Record<number, NotationDuration>> = {
	1: 'sixteenth',
	2: 'eighth',
	3: 'dottedEighth',
	4: 'quarter',
	6: 'dottedQuarter',
	8: 'half',
	12: 'dottedHalf',
	16: 'whole',
};

/** Power-of-two cell counts from longest to shortest. */
export const POWER_OF_TWO_CELLS = [16, 8, 4, 2, 1] as const;

/**
 * Note/rest spelling lengths including single dots (Gould-style greedy pick).
 * Longest first.
 */
export const SPELLING_CELL_LENGTHS = [16, 12, 8, 6, 4, 3, 2, 1] as const;

export function cellsForDuration(duration: NotationDuration): number {
	return CELLS_BY_DURATION[duration];
}

/**
 * Map a cell span to a duration (powers of two and single-dotted values).
 */
export function durationForCells(cells: number): NotationDuration | undefined {
	return DURATION_BY_CELLS[cells];
}

export function beatIndex(cell: number): number {
	return Math.floor(cell / CELLS_PER_BEAT);
}

export function beatStartCell(beat: number): number {
	return beat * CELLS_PER_BEAT;
}

export function cellsUntilBeatEnd(cell: number): number {
	const end = (beatIndex(cell) + 1) * CELLS_PER_BEAT;
	return end - cell;
}

export function isHalfBarBoundary(cell: number): boolean {
	return cell === HALF_BAR_CELL;
}

export function clampCell(cell: number): number {
	return Math.max(0, Math.min(MEASURE_LENGTH, cell));
}

/** Smallest power-of-two cell unit allowed for a subdivision level. */
export function minCellUnitForLevel(
	level: 'quarters' | 'eighths' | 'sixteenths',
): number {
	switch (level) {
		case 'quarters':
			return 4;
		case 'eighths':
			return 2;
		case 'sixteenths':
			return 1;
	}
}
