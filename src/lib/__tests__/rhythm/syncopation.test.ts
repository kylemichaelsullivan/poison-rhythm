import { describe, expect, test } from 'bun:test';
import { ALL_BEATS } from '@/lib/rhythm/grid';
import { createPRNG } from '@/lib/rhythm/prng';
import { pickHitIndices } from '@/lib/rhythm/syncopation';

describe('pickHitIndices', () => {
	test('difficulty 1 uses downbeats only', () => {
		const rng = createPRNG(777);
		const indices = pickHitIndices(ALL_BEATS, 3, 1, rng);
		expect(indices.every((i) => i % 4 === 0)).toBe(true);
	});

	test('difficulty 5 can use full sixteenth grid', () => {
		const rng = createPRNG(888);
		const indices = pickHitIndices(ALL_BEATS, 8, 5, rng);
		expect(indices).toHaveLength(8);
		expect(indices.some((i) => i % 4 !== 0)).toBe(true);
	});
});
