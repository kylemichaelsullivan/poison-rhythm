import { measureToNotationEvents } from './notation-events';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import type { NotationDuration } from './notation-duration';

/**
 * Overlay-friendly step derived from spelled notation events.
 * One step per event so beamed notes highlight independently.
 */
export type NotationStep = {
	stepIndex: number;
	kind: 'note' | 'rest';
	duration: NotationDuration;
	hit: boolean;
	accent?: boolean;
	sticking?: 'L' | 'R';
	startCell: number;
	durationCells: number;
	tieContinuation?: boolean;
	beamGroupId?: number;
};

/** Inclusive cell span covered by a glyph token’s events. */
export function tokenCellSpan(
	events: {
		startCell: number;
		durationCells: number;
	}[],
): { startCell: number; durationCells: number } {
	let startCell = Number.POSITIVE_INFINITY;
	let endCell = Number.NEGATIVE_INFINITY;
	for (const event of events) {
		startCell = Math.min(startCell, event.startCell);
		endCell = Math.max(endCell, event.startCell + event.durationCells);
	}
	if (!Number.isFinite(startCell) || !Number.isFinite(endCell)) {
		return { startCell: 0, durationCells: 0 };
	}
	return { startCell, durationCells: Math.max(0, endCell - startCell) };
}

/**
 * Spell the measure with conventional 4/4 notation and emit one visual step
 * per event (beams are drawn separately via `beamGroupId`).
 */
export function measureToNotationSteps(
	measure: RhythmMeasure,
	richMeasure: RichRhythmMeasure | undefined,
	level: SubdivisionLevel,
): NotationStep[] {
	const events = measureToNotationEvents(measure, richMeasure, level);

	return events.map((event, stepIndex) => {
		const hit = event.kind === 'note' && !event.tieContinuation;
		return {
			stepIndex,
			kind: event.kind,
			duration: event.duration,
			hit,
			accent: hit ? event.accent : undefined,
			sticking: hit ? event.sticking : undefined,
			startCell: event.startCell,
			durationCells: event.durationCells,
			tieContinuation: event.tieContinuation,
			beamGroupId: event.beamGroupId,
		};
	});
}
