import { describe, expect, test } from 'bun:test';
import {
	DIFFICULTY_LEVELS,
	DIFFICULTY_MAX,
	DIFFICULTY_MIN,
	formatDifficultyHelpText,
	hitRangeForLevel,
} from './difficulty-levels';

describe('difficulty-levels', () => {
	test('exposes five levels with clamped hit ranges', () => {
		expect(DIFFICULTY_LEVELS).toHaveLength(5);
		expect(DIFFICULTY_MIN).toBe(1);
		expect(DIFFICULTY_MAX).toBe(5);
		expect(hitRangeForLevel(0)).toEqual([2, 4]);
		expect(hitRangeForLevel(99)).toEqual([10, 14]);
	});

	test('formats help text with typographic en dash', () => {
		expect(formatDifficultyHelpText(DIFFICULTY_LEVELS[0])).toBe(
			'Fewest hits (2–4), only on the downbeats (1, 2, 3, 4).',
		);
	});
});
