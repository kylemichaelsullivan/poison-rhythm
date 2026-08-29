import { describe, expect, test } from 'bun:test';
import {
	isPoisonVisible,
	poisonProbability,
	shouldHidePoisonDuringPlayback,
	shouldInjectPoison,
} from '@/lib/rhythm/poison';
import { createPRNG } from '@/lib/rhythm/prng';

describe('poison', () => {
	test('poisonProbability increases with index in classic ramp', () => {
		const low = poisonProbability(1, 3);
		const high = poisonProbability(5, 3);
		expect(high).toBeGreaterThan(low);
	});

	test('stationary probability does not grow with index', () => {
		const a = poisonProbability(1, 3, { stationary: true });
		const b = poisonProbability(50, 3, { stationary: true });
		expect(a).toBe(b);
	});

	test('higher difficulty lowers poison probability', () => {
		expect(poisonProbability(3, 5)).toBeLessThan(poisonProbability(3, 1));
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
