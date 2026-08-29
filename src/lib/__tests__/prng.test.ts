import { describe, expect, test } from 'bun:test';
import { createPRNG } from '@/lib/rhythm/prng';

describe('prng', () => {
	test('same seed produces same sequence', () => {
		const a = createPRNG(42);
		const b = createPRNG(42);
		const seqA = [a.next(), a.next(), a.nextInt(1, 10)];
		const seqB = [b.next(), b.next(), b.nextInt(1, 10)];
		expect(seqA).toEqual(seqB);
	});

	test('different seeds produce different sequences', () => {
		const a = createPRNG(1);
		const b = createPRNG(2);
		expect(a.next()).not.toBe(b.next());
	});

	test('pickMany returns requested count', () => {
		const rng = createPRNG(99);
		const picked = rng.pickMany([1, 2, 3, 4, 5], 3);
		expect(picked).toHaveLength(3);
	});
});
