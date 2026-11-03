import { eventsToGlyphTokens } from './events-to-musisync';
import { measureToNotationEvents } from './notation-events';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';

/**
 * Overlay-friendly step derived from spelled (+ beamed) notation glyphs.
 * `stepIndex` is the visual glyph index in the MusiSync string.
 * `startCell` / `durationCells` span the full visual token (beamed groups
 * cover every collapsed event).
 */
export type NotationStep = {
	stepIndex: number;
	hit: boolean;
	accent?: boolean;
	sticking?: 'L' | 'R';
	glyph: string;
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
 * Spell the measure with conventional 4/4 notation and MusiSync beaming,
 * then flatten to overlay-friendly steps (one per visual glyph).
 */
export function measureToNotationSteps(
	measure: RhythmMeasure,
	richMeasure: RichRhythmMeasure | undefined,
	level: SubdivisionLevel,
): NotationStep[] {
	const events = measureToNotationEvents(measure, richMeasure, level);
	const tokens = eventsToGlyphTokens(events);

	return tokens.map((token, stepIndex) => {
		const onset = token.events.find(
			(event) => event.kind === 'note' && !event.tieContinuation,
		);
		const primary = onset ?? token.events[0];
		const span = tokenCellSpan(token.events);
		return {
			stepIndex,
			hit: Boolean(onset),
			accent: onset?.accent,
			sticking: onset?.sticking,
			glyph: token.glyph,
			startCell: span.startCell,
			durationCells: span.durationCells,
			tieContinuation: primary?.tieContinuation,
			beamGroupId: onset?.beamGroupId,
		};
	});
}

export function notationStepsToGlyphString(steps: NotationStep[]): string {
	return steps.map((step) => step.glyph).join('');
}
