import { describe, expect, test } from 'bun:test';
import {
	INTRO_FAIL_REVEAL_MS,
	INTRO_LOSE_UNDERLINE_MS,
	INTRO_PLAY_HALO_AFTER_MS,
	INTRO_POISON_BEATS,
	INTRO_POISON_FAIL_LOSE,
	INTRO_POISON_FAIL_POISON,
	INTRO_POISON_PROMPT,
	INTRO_SIMON_SAYS_PROMPT,
	INTRO_TUTORIAL_STEPS,
	quarterNoteMeasure,
} from '../intro-tutorial';

describe('quarterNoteMeasure', () => {
	test('places hits only on quarter downbeats', () => {
		expect(quarterNoteMeasure([0, 2])).toEqual([
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		]);
	});

	test('ignores beats outside 0–3', () => {
		expect(quarterNoteMeasure([-1, 4, 1])[4]).toBe(true);
		expect(quarterNoteMeasure([-1, 4, 1]).filter(Boolean)).toEqual([true]);
	});
});

describe('intro tutorial steps', () => {
	test('shows two safe bars, then the poison', () => {
		expect(INTRO_TUTORIAL_STEPS.map((step) => step.isPoison)).toEqual([
			false,
			false,
			true,
		]);
		expect(INTRO_TUTORIAL_STEPS[0]?.prompt).toBe(INTRO_SIMON_SAYS_PROMPT);
		expect(INTRO_TUTORIAL_STEPS[2]?.prompt).toBe(INTRO_POISON_PROMPT);
		expect(INTRO_POISON_FAIL_POISON).toBe('That’s the Poison…');
		expect(INTRO_POISON_FAIL_LOSE).toBe('Play it, and you lose!');
		expect(INTRO_FAIL_REVEAL_MS).toBe(1000);
		expect(INTRO_LOSE_UNDERLINE_MS).toBe(600);
		expect(INTRO_PLAY_HALO_AFTER_MS).toBe(
			INTRO_FAIL_REVEAL_MS * 2 + INTRO_LOSE_UNDERLINE_MS,
		);
		expect(INTRO_TUTORIAL_STEPS[2]?.beats).toEqual(INTRO_POISON_BEATS);
	});
});
