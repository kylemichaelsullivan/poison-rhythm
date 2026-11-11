import { MEASURE_LENGTH } from '@/types';
import type { NotationStep } from './measure-to-notation';

/**
 * Length-16 lookup: sixteenth-cell → visual glyph `stepIndex`.
 * Each spelled event paints every cell in its own duration span.
 */
export function buildNotationCellStepMap(
	steps: ReadonlyArray<
		Pick<NotationStep, 'stepIndex' | 'startCell' | 'durationCells'>
	>,
): ReadonlyArray<number | null> {
	const map: (number | null)[] = Array.from(
		{ length: MEASURE_LENGTH },
		() => null,
	);

	for (const step of steps) {
		const end = Math.min(MEASURE_LENGTH, step.startCell + step.durationCells);
		for (let cell = Math.max(0, step.startCell); cell < end; cell += 1) {
			map[cell] = step.stepIndex;
		}
	}

	return map;
}

/** O(1) active glyph index for a playhead cell, or null outside the map. */
export function activeNotationStepIndex(
	map: ReadonlyArray<number | null>,
	cell: number,
): number | null {
	if (cell < 0 || cell >= map.length) return null;
	return map[cell] ?? null;
}
