import { describe, expect, test } from 'bun:test';
import { createPRNG } from '@/lib/rhythm/prng';
import { applySticking } from '@/lib/rhythm/sticking';
import { createEmptyRichMeasure } from '@/types';

describe('sticking', () => {
	test('alternating assigns R then L', () => {
		const measure = createEmptyRichMeasure();
		measure[0].hit = true;
		measure[4].hit = true;
		measure[8].hit = true;

		const result = applySticking(measure, 'alternating', createPRNG(1));
		expect(result[0].sticking).toBe('R');
		expect(result[4].sticking).toBe('L');
		expect(result[8].sticking).toBe('R');
	});

	test('dominant assigns all R', () => {
		const measure = createEmptyRichMeasure();
		measure[0].hit = true;
		measure[4].hit = true;

		const result = applySticking(measure, 'dominant', createPRNG(1));
		expect(result[0].sticking).toBe('R');
		expect(result[4].sticking).toBe('R');
	});

	test('off leaves sticking undefined', () => {
		const measure = createEmptyRichMeasure();
		measure[0].hit = true;
		const result = applySticking(measure, 'off', createPRNG(1));
		expect(result[0].sticking).toBeUndefined();
	});
});
