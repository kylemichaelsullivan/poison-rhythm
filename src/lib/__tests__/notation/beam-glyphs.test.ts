import { describe, expect, test } from 'bun:test';
import {
	beamedGlyphForDurations,
	MUSISYNC_BEAMED,
	resolveBeamedGlyph,
} from '@/lib/notation/beam-glyphs';

describe('beamedGlyphForDurations', () => {
	test('maps conventional beat patterns to MusiSync beamed glyphs', () => {
		expect(beamedGlyphForDurations([2, 2])).toBe(MUSISYNC_BEAMED.twoEighths);
		expect(beamedGlyphForDurations([1, 1, 1, 1])).toBe(
			MUSISYNC_BEAMED.fourSixteenths,
		);
		expect(beamedGlyphForDurations([1, 1, 1])).toBe(
			MUSISYNC_BEAMED.threeSixteenths,
		);
		expect(beamedGlyphForDurations([2, 1, 1])).toBe(
			MUSISYNC_BEAMED.eighthTwoSixteenths,
		);
		expect(beamedGlyphForDurations([1, 1, 2])).toBe(
			MUSISYNC_BEAMED.twoSixteenthsEighth,
		);
		expect(beamedGlyphForDurations([1, 2, 1])).toBe(
			MUSISYNC_BEAMED.sixteenthEighthSixteenth,
		);
		expect(beamedGlyphForDurations([3, 1])).toBe(
			MUSISYNC_BEAMED.dottedEighthSixteenth,
		);
		expect(beamedGlyphForDurations([1, 3])).toBe(
			MUSISYNC_BEAMED.sixteenthDottedEighth,
		);
		expect(beamedGlyphForDurations([1, 2])).toBe(
			MUSISYNC_BEAMED.sixteenthEighth,
		);
		expect(beamedGlyphForDurations([2, 2, 2])).toBe(
			MUSISYNC_BEAMED.threeEighths,
		);
		expect(beamedGlyphForDurations([2, 2, 2, 2])).toBe(
			MUSISYNC_BEAMED.fourEighths,
		);
	});

	test('returns undefined for unmatched or singleton patterns', () => {
		expect(beamedGlyphForDurations([2])).toBeUndefined();
		expect(beamedGlyphForDurations([1, 1])).toBeUndefined();
		expect(beamedGlyphForDurations([4, 4])).toBeUndefined();
	});

	test('maps three sixteenths to MusiSync superscript-3 glyph', () => {
		expect(MUSISYNC_BEAMED.threeSixteenths).toBe('³');
		expect(
			resolveBeamedGlyph([
				{ startCell: 1, durationCells: 1 },
				{ startCell: 2, durationCells: 1 },
				{ startCell: 3, durationCells: 1 },
			]),
		).toBe(MUSISYNC_BEAMED.threeSixteenths);
	});
});

describe('resolveBeamedGlyph', () => {
	test('maps exact duration patterns only', () => {
		expect(
			resolveBeamedGlyph([
				{ startCell: 0, durationCells: 1 },
				{ startCell: 1, durationCells: 3 },
			]),
		).toBe(MUSISYNC_BEAMED.sixteenthDottedEighth);
	});

	test('beams sixteenth + eighth [1,2] with derived undotted O, not stock O', () => {
		expect(
			resolveBeamedGlyph([
				{ startCell: 5, durationCells: 1 },
				{ startCell: 6, durationCells: 2 },
			]),
		).toBe(MUSISYNC_BEAMED.sixteenthEighth);
		expect(MUSISYNC_BEAMED.sixteenthEighth).not.toBe(
			MUSISYNC_BEAMED.sixteenthDottedEighth,
		);
		expect(
			resolveBeamedGlyph([
				{ startCell: 6, durationCells: 1 },
				{ startCell: 7, durationCells: 2 },
			]),
		).toBe(MUSISYNC_BEAMED.sixteenthEighth);
	});
});
