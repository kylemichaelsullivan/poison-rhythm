import { describe, expect, test } from 'bun:test';
import {
	DIFFICULTY_LEVELS,
	DIFFICULTY_MAX,
	DIFFICULTY_MIN,
	difficultyPlacementHelp,
	formatDifficultyHelpText,
	hitRangeForLevel,
	subdivisionForSlotCount,
} from '../difficulty-levels';

describe('difficulty-levels', () => {
	test('exposes five levels with clamped hit ranges', () => {
		expect(DIFFICULTY_LEVELS).toHaveLength(5);
		expect(DIFFICULTY_MIN).toBe(1);
		expect(DIFFICULTY_MAX).toBe(5);
		expect(hitRangeForLevel(0)).toEqual([2, 4]);
		expect(hitRangeForLevel(99)).toEqual([10, 14]);
	});

	test('uses hardcoded ranges per subdivision instead of collapsing bands', () => {
		expect(hitRangeForLevel(1, 8)).toEqual([1, 2]);
		expect(hitRangeForLevel(5, 8)).toEqual([5, 7]);
		expect(hitRangeForLevel(1, 4)).toEqual([1, 2]);
		expect(hitRangeForLevel(3, 4)).toEqual([2, 3]);
		expect(hitRangeForLevel(5, 4)).toEqual([3, 4]);
		for (let level = 1; level <= 5; level += 1) {
			const [min, max] = hitRangeForLevel(level, 4);
			expect(max).toBeGreaterThan(min);
		}
	});

	test('maps slot counts to subdivision keys', () => {
		expect(subdivisionForSlotCount(16)).toBe('sixteenths');
		expect(subdivisionForSlotCount(8)).toBe('eighths');
		expect(subdivisionForSlotCount(4)).toBe('quarters');
	});

	test('omits placement help on quarters where only downbeats exist', () => {
		expect(difficultyPlacementHelp(1, 'quarters')).toBeNull();
		expect(difficultyPlacementHelp(5, 'quarters')).toBeNull();
		expect(formatDifficultyHelpText(1, 'quarters')).toBe('1–2 hits');
		expect(formatDifficultyHelpText(5, 'quarters')).toBe('3–4 hits');
	});

	test('placement help matches pickHitIndices bands on finer grids', () => {
		expect(formatDifficultyHelpText(1, 'sixteenths')).toBe(
			'2–4 hits — downbeats only',
		);
		expect(formatDifficultyHelpText(2, 'eighths')).toBe(
			'2–3 hits — mostly downbeats',
		);
		expect(formatDifficultyHelpText(3, 'sixteenths')).toBe(
			'6–8 hits — some offbeats',
		);
		expect(formatDifficultyHelpText(4, 'eighths')).toBe('4–5 hits — any beat');
		expect(formatDifficultyHelpText(5, 'sixteenths')).toBe(
			'10–14 hits — any beat',
		);
	});
});
