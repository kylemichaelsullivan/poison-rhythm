import { describe, expect, test } from 'bun:test';
import {
	DIFFICULTY_LEVELS,
	DIFFICULTY_MAX,
	DIFFICULTY_MIN,
	formatDifficultyHelpText,
	hitRangeForLevel,
	scaleHitRange,
} from '../difficulty-levels';

describe('difficulty-levels', () => {
	test('exposes five levels with clamped hit ranges', () => {
		expect(DIFFICULTY_LEVELS).toHaveLength(5);
		expect(DIFFICULTY_MIN).toBe(1);
		expect(DIFFICULTY_MAX).toBe(5);
		expect(hitRangeForLevel(0)).toEqual([2, 4]);
		expect(hitRangeForLevel(99)).toEqual([10, 14]);
	});

	test('scales hit ranges onto eighth and quarter grids', () => {
		expect(hitRangeForLevel(5, 8)).toEqual([5, 7]);
		expect(hitRangeForLevel(1, 8)).toEqual([1, 2]);
		expect(hitRangeForLevel(5, 4)).toEqual([3, 4]);
		expect(scaleHitRange([8, 10], 8)).toEqual([4, 5]);
	});

	test('formats help text with typographic en dash', () => {
		expect(formatDifficultyHelpText(DIFFICULTY_LEVELS[0])).toBe(
			'Fewest hits (2–4 on 1/16; scales with subdivision), only on the downbeats.',
		);
	});
});
