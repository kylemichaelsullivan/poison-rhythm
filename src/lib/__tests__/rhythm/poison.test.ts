import { describe, expect, test } from 'bun:test';
import {
	isPoisonVisible,
	poisonBaseRate,
	poisonProbability,
	poisonRampDelay,
	shouldHidePoisonDuringPlayback,
	shouldInjectPoison,
} from '@/lib/rhythm/poison';
import { createPRNG } from '@/lib/rhythm/prng';

describe('poison', () => {
	test('poisonProbability increases with index in classic ramp', () => {
		const low = poisonProbability(3, 3);
		const high = poisonProbability(8, 3);
		expect(high).toBeGreaterThan(low);
	});

	test('stationary probability does not grow with index', () => {
		const a = poisonProbability(1, 3, { stationary: true });
		const b = poisonProbability(50, 3, { stationary: true });
		expect(a).toBe(b);
	});

	test('higher difficulty lowers poison probability', () => {
		expect(poisonProbability(6, 5)).toBeLessThan(poisonProbability(6, 1));
	});

	test('higher difficulty delays the classic ramp', () => {
		expect(poisonRampDelay(1)).toBe(0);
		expect(poisonRampDelay(5)).toBe(4);
		expect(poisonProbability(4, 5)).toBe(0);
		expect(poisonProbability(5, 5)).toBeCloseTo(poisonBaseRate(5));
		expect(poisonProbability(1, 1)).toBeCloseTo(poisonBaseRate(1));
	});

	test('shouldInjectPoison returns false when mode is off', () => {
		const rng = createPRNG(1);
		expect(shouldInjectPoison('off', 3, rng, 3)).toBe(false);
	});

	test('visible always shows; hidden conceals during playback', () => {
		expect(isPoisonVisible('visible')).toBe(true);
		expect(isPoisonVisible('hidden')).toBe(false);
		expect(isPoisonVisible('off')).toBe(false);
		expect(shouldHidePoisonDuringPlayback('hidden')).toBe(true);
		expect(shouldHidePoisonDuringPlayback('visible')).toBe(false);
	});
});
