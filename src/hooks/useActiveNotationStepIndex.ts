import { useMemo } from 'react';
import { useSubdivision } from '@/contexts';
import {
	activeNotationStepIndex,
	buildNotationCellStepMap,
} from '@/lib/notation';
import { subdivisionStepToCell } from '@/lib/subdivision-playback';
import type { NotationStep } from '@/lib/notation';

/**
 * Active notation glyph index for the current playhead cell, or null when
 * highlighting is disabled. Pass fractional `progress` from
 * {@link useSubdivisionProgress} so cursor and glyph share one RAF.
 */
export function useActiveNotationStepIndex(
	steps: ReadonlyArray<NotationStep>,
	enabled: boolean,
	progress: number,
): number | null {
	const { subdivisionLevel } = useSubdivision();
	const cellMap = useMemo(() => buildNotationCellStepMap(steps), [steps]);

	if (!enabled) return null;

	const cell = subdivisionStepToCell(subdivisionLevel, progress);
	return activeNotationStepIndex(cellMap, cell);
}
