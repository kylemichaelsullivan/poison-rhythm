/**
 * Precomposed MusiSync beamed-note glyphs (Allgeyer MusiSync v5).
 * Patterns are comma-joined durationCells within one beam group.
 */

export const MUSISYNC_BEAMED = {
	/** Two beamed eighths */
	twoEighths: 'n',
	/** Four beamed sixteenths */
	fourSixteenths: 'y',
	/** Three beamed sixteenths (e.g. after a sixteenth rest in the beat) */
	threeSixteenths: '³',
	/** Eighth + two sixteenths */
	eighthTwoSixteenths: 'm',
	/** Two sixteenths + eighth */
	twoSixteenthsEighth: 'M',
	/** Sixteenth + eighth + sixteenth (gallop / middle-of-beat syncopation) */
	sixteenthEighthSixteenth: '¾',
	/** Dotted eighth + sixteenth */
	dottedEighthSixteenth: 'o',
	/** Sixteenth + dotted eighth */
	sixteenthDottedEighth: 'O',
	/** Three beamed eighths */
	threeEighths: '§',
	/** Four beamed eighths */
	fourEighths: 'Y',
} as const;

const PATTERN_TO_GLYPH: Record<string, string> = {
	'2,2': MUSISYNC_BEAMED.twoEighths,
	'1,1,1,1': MUSISYNC_BEAMED.fourSixteenths,
	'1,1,1': MUSISYNC_BEAMED.threeSixteenths,
	'2,1,1': MUSISYNC_BEAMED.eighthTwoSixteenths,
	'1,1,2': MUSISYNC_BEAMED.twoSixteenthsEighth,
	'1,2,1': MUSISYNC_BEAMED.sixteenthEighthSixteenth,
	'3,1': MUSISYNC_BEAMED.dottedEighthSixteenth,
	'1,3': MUSISYNC_BEAMED.sixteenthDottedEighth,
	'2,2,2': MUSISYNC_BEAMED.threeEighths,
	'2,2,2,2': MUSISYNC_BEAMED.fourEighths,
};

export type BeamedNoteSlice = {
	startCell: number;
	durationCells: number;
};

export function beamedGlyphForDurations(
	durationCells: number[],
): string | undefined {
	if (durationCells.length < 2) {
		return undefined;
	}
	return PATTERN_TO_GLYPH[durationCells.join(',')];
}

/**
 * Map a contiguous beam run to a MusiSync beamed glyph.
 * Only exact duration patterns are beamed — e.g. `[1, 2]` (sixteenth + eighth)
 * has no precomposed glyph and must stay flagged rather than aliasing to `O`
 * (sixteenth + dotted eighth), which would misread the rhythm.
 */
export function resolveBeamedGlyph(
	notes: readonly BeamedNoteSlice[],
): string | undefined {
	return beamedGlyphForDurations(notes.map((note) => note.durationCells));
}
