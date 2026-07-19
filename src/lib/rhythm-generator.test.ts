import { describe, expect, test } from 'bun:test';
import { hitRangeForLevel } from './difficulty-levels';
import { generateRandomMeasure } from './rhythm-generator';
import { countHits, isValidRhythm } from './rhythm-utils';

describe('rhythm-generator', () => {
	test('generates valid measures within each difficulty hit range', () => {
		for (let level = 1; level <= 5; level++) {
			const [min, max] = hitRangeForLevel(level);

			for (let i = 0; i < 200; i++) {
				const rhythm = generateRandomMeasure(level);
				const hits = countHits(rhythm);

				expect(isValidRhythm(rhythm)).toBe(true);
				expect(hits).toBeGreaterThanOrEqual(min);
				expect(hits).toBeLessThanOrEqual(max);

				if (level === 1) {
					rhythm.forEach((hit, index) => {
						if (hit) {
							expect(index % 4).toBe(0);
						}
					});
				}
			}
		}
	});
});
