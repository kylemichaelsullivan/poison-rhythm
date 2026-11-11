import type { SubdivisionLevel } from '@/lib/preference-schemas';

/** Conventional 4/4 note/rest durations used by the spelling pipeline. */
export type NotationDuration =
	| 'whole'
	| 'dottedHalf'
	| 'half'
	| 'dottedQuarter'
	| 'quarter'
	| 'dottedEighth'
	| 'eighth'
	| 'sixteenth';

export type NotationGlyphKind = 'note' | 'rest';

const DOTTED: ReadonlySet<NotationDuration> = new Set([
	'dottedHalf',
	'dottedQuarter',
	'dottedEighth',
]);

/** True when the duration carries an augmentation dot. */
export function isDottedDuration(duration: NotationDuration): boolean {
	return DOTTED.has(duration);
}

/** Undotted base shape for a possibly dotted duration (for SVG rendering). */
export function baseDuration(duration: NotationDuration): NotationDuration {
	switch (duration) {
		case 'dottedHalf':
			return 'half';
		case 'dottedQuarter':
			return 'quarter';
		case 'dottedEighth':
			return 'eighth';
		default:
			return duration;
	}
}

/** How many secondary (16th) beam levels a note needs (0 = eighth+, 1 = sixteenth). */
export function secondaryBeamCount(durationCells: number): number {
	return durationCells <= 1 ? 1 : 0;
}

function durationForLevel(level: SubdivisionLevel): NotationDuration {
	switch (level) {
		case 'quarters':
			return 'quarter';
		case 'eighths':
			return 'eighth';
		case 'sixteenths':
			return 'sixteenth';
	}
}

/** Subdivision control: duration + step count for the ShowNotes trigger. */
export function durationInfoForLevel(level: SubdivisionLevel): {
	duration: NotationDuration;
	stepCount: number;
} {
	const duration = durationForLevel(level);
	const stepCount = level === 'quarters' ? 4 : level === 'eighths' ? 8 : 16;
	return { duration, stepCount };
}
