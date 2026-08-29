import { describe, expect, test } from 'bun:test';
import { computeHitCount } from '@/lib/rhythm/density';
import { generateMeasure } from '@/lib/rhythm/generate-measure';
import { createPRNG } from '@/lib/rhythm/prng';
import { countHits } from '@/lib/rhythm-utils';
import { DEFAULT_SETTINGS } from '@/lib/settings-schema';
import { richToLegacyMeasure } from '@/types';

describe('rhythm hit count', () => {
	test('higher difficulty produces more hits on average', () => {
		const rng = createPRNG(123);
		let lowTotal = 0;
		let highTotal = 0;

		for (let i = 0; i < 50; i += 1) {
			lowTotal += computeHitCount(1, rng);
			highTotal += computeHitCount(5, rng);
		}

		expect(highTotal).toBeGreaterThan(lowTotal);
	});

	test('eighths stay below a full grid at max difficulty', () => {
		const rng = createPRNG(42);
		for (let i = 0; i < 40; i += 1) {
			const hits = computeHitCount(5, rng, 8);
			expect(hits).toBeGreaterThanOrEqual(5);
			expect(hits).toBeLessThanOrEqual(7);
		}
	});
});

describe('generateMeasure', () => {
	test('same seed produces identical measure', () => {
		const opts = {
			difficulty: 3,
			subdivisionLevel: 'eighths' as const,
			settings: DEFAULT_SETTINGS,
			seed: 555,
		};
		const a = generateMeasure(opts);
		const b = generateMeasure(opts);
		expect(a).toEqual(b);
	});

	test('generated measure has valid hit count for difficulty', () => {
		const measure = generateMeasure({
			difficulty: 1,
			subdivisionLevel: 'sixteenths',
			settings: DEFAULT_SETTINGS,
			seed: 100,
		});
		const legacy = richToLegacyMeasure(measure);
		const hits = countHits(legacy);
		expect(hits).toBeGreaterThanOrEqual(2);
		expect(hits).toBeLessThanOrEqual(4);
	});

	test('difficulty 5 on eighths does not fill every slot', () => {
		const hitCounts = new Set<number>();
		for (let seed = 0; seed < 30; seed += 1) {
			const measure = generateMeasure({
				difficulty: 5,
				subdivisionLevel: 'eighths',
				settings: DEFAULT_SETTINGS,
				seed,
			});
			const hits = countHits(richToLegacyMeasure(measure));
			expect(hits).toBeLessThan(8);
			hitCounts.add(hits);
		}
		expect(hitCounts.size).toBeGreaterThan(1);
	});

	test('exclude retry stays bounded on tiny grids', () => {
		const exclude = generateMeasure({
			difficulty: 5,
			subdivisionLevel: 'quarters',
			settings: DEFAULT_SETTINGS,
			seed: 1,
		});
		const measure = generateMeasure({
			difficulty: 5,
			subdivisionLevel: 'quarters',
			settings: DEFAULT_SETTINGS,
			seed: 1,
			exclude,
		});
		expect(measure).toHaveLength(16);
	});
});
