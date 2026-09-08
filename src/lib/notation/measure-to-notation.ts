import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { eventsToGlyphTokens } from './events-to-musisync';
import { measureToNotationEvents } from './notation-events';

/**
 * Overlay-friendly step derived from spelled (+ beamed) notation glyphs.
 * `stepIndex` is the visual glyph index in the MusiSync string.
 */
export type NotationStep = {
	stepIndex: number;
	hit: boolean;
	accent?: boolean;
	sticking?: 'L' | 'R';
	glyph: string;
	startCell?: number;
	tieContinuation?: boolean;
	beamGroupId?: number;
};

/**
 * Spell the measure with contemporary conventions and MusiSync beaming,
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
		return {
			stepIndex,
			hit: Boolean(onset),
			accent: onset?.accent,
			sticking: onset?.sticking,
			glyph: token.glyph,
			startCell: primary?.startCell,
			tieContinuation: primary?.tieContinuation,
			beamGroupId: onset?.beamGroupId,
		};
	});
}

export function notationStepsToGlyphString(steps: NotationStep[]): string {
	return steps.map((step) => step.glyph).join('');
}
