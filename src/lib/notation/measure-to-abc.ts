import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { cellsForDuration } from './duration-units';
import { measureToNotationEvents, type NotationEvent } from './notation-events';

export type AbcTuneOptions = {
	title?: string;
	/** Tune index (X: field). Default 1. */
	index?: number;
};

/**
 * Convert spelled notation events to an ABC rhythm body (L:1/16, neutral perc).
 * Notes use `c` (unpitched); rests use `z`. Durations are in sixteenth units
 * (`c` = 16th, `c2` = 8th, `c4` = quarter, …).
 */
export function eventsToAbcBody(events: NotationEvent[]): string {
	const parts: string[] = [];
	for (const event of events) {
		const units = event.durationCells;
		const letter = event.kind === 'rest' ? 'z' : 'c';
		parts.push(units === 1 ? letter : `${letter}${units}`);
	}
	return `${parts.join(' ')} |]`;
}

/**
 * Full ABC tune for a measure — conventional 4/4 rhythmic (percussion) notation.
 */
export function eventsToAbc(
	events: NotationEvent[],
	options: AbcTuneOptions = {},
): string {
	const title = options.title ?? 'Rhythm';
	const index = options.index ?? 1;
	return [
		`X:${index}`,
		`T:${title}`,
		'M:4/4',
		'L:1/16',
		'K:C',
		'V:1 clef=perc',
		'%%beambrack 4',
		eventsToAbcBody(events),
	].join('\n');
}

/** Spell a measure and emit a conventional ABC tune. */
export function measureToAbc(
	measure: RhythmMeasure,
	richMeasure: RichRhythmMeasure | undefined,
	level: SubdivisionLevel,
	options?: AbcTuneOptions,
): string {
	const events = measureToNotationEvents(measure, richMeasure, level);
	return eventsToAbc(events, options);
}

/** Sixteenth-unit length for an event duration (for tests / ABC checks). */
export function abcUnitsForEvent(event: NotationEvent): number {
	return event.durationCells || cellsForDuration(event.duration);
}
