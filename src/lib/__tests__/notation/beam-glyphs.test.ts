import { describe, expect, test } from 'bun:test';
import {
	beamedGlyphForDurations,
	MUSISYNC_BEAMED,
} from '@/lib/notation/beam-glyphs';

describe('beamedGlyphForDurations', () => {
	test('maps conventional beat patterns to MusiSync beamed glyphs', () => {
		expect(beamedGlyphForDurations([2, 2])).toBe(MUSISYNC_BEAMED.twoEighths);
		expect(beamedGlyphForDurations([1, 1, 1, 1])).toBe(
			MUSISYNC_BEAMED.fourSixteenths,
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
});
