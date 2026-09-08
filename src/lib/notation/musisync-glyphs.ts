import type { SubdivisionLevel } from '@/lib/preference-schemas';

/**
 * Conventional MusiSync v5 duration keys (Allgeyer mnemonic):
 * notes = lowercase w/h/q/e/s, rests = uppercase W/H/Q/E/S.
 * Dotted notes use dedicated glyphs (`i` / `j` / `d`). Dotted rests compose
 * base rest + augmentation dot (`.`).
 */
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

export const MUSISYNC_GLYPH = {
	wholeNote: 'w',
	wholeRest: 'H',
	dottedHalfNote: 'd',
	halfNote: 'h',
	halfRest: 'W',
	dottedQuarterNote: 'j',
	quarterNote: 'q',
	quarterRest: 'Q',
	dottedEighthNote: 'i',
	eighthNote: 'e',
	eighthRest: 'E',
	sixteenthNote: 's',
	sixteenthRest: 'S',
	/** Augmentation dot (compose after a rest glyph). */
	augmentationDot: '.',
} as const;

const NOTE_BY_DURATION: Record<NotationDuration, string> = {
	whole: MUSISYNC_GLYPH.wholeNote,
	dottedHalf: MUSISYNC_GLYPH.dottedHalfNote,
	half: MUSISYNC_GLYPH.halfNote,
	dottedQuarter: MUSISYNC_GLYPH.dottedQuarterNote,
	quarter: MUSISYNC_GLYPH.quarterNote,
	dottedEighth: MUSISYNC_GLYPH.dottedEighthNote,
	eighth: MUSISYNC_GLYPH.eighthNote,
	sixteenth: MUSISYNC_GLYPH.sixteenthNote,
};

const REST_BY_DURATION: Record<NotationDuration, string> = {
	whole: MUSISYNC_GLYPH.wholeRest,
	dottedHalf: `${MUSISYNC_GLYPH.halfRest}${MUSISYNC_GLYPH.augmentationDot}`,
	half: MUSISYNC_GLYPH.halfRest,
	dottedQuarter: `${MUSISYNC_GLYPH.quarterRest}${MUSISYNC_GLYPH.augmentationDot}`,
	quarter: MUSISYNC_GLYPH.quarterRest,
	dottedEighth: `${MUSISYNC_GLYPH.eighthRest}${MUSISYNC_GLYPH.augmentationDot}`,
	eighth: MUSISYNC_GLYPH.eighthRest,
	sixteenth: MUSISYNC_GLYPH.sixteenthRest,
};

/** Map a conventional note/rest duration to its MusiSync character(s). */
export function musisyncGlyphFor(
	kind: NotationGlyphKind,
	duration: NotationDuration,
): string {
	return kind === 'note'
		? NOTE_BY_DURATION[duration]
		: REST_BY_DURATION[duration];
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

export function durationGlyphsForLevel(level: SubdivisionLevel): {
	note: string;
	rest: string;
	stepCount: number;
	duration: NotationDuration;
} {
	const duration = durationForLevel(level);
	const stepCount = level === 'quarters' ? 4 : level === 'eighths' ? 8 : 16;

	return {
		duration,
		note: musisyncGlyphFor('note', duration),
		rest: musisyncGlyphFor('rest', duration),
		stepCount,
	};
}
