import { describe, expect, test } from 'bun:test';
import {
	generateAppendBatch,
	generateRound,
} from '@/lib/rhythm/generate-round';
import { DEFAULT_SETTINGS, sanitizeGameSettings } from '@/lib/settings-schema';
import { richMeasuresEqual } from '@/types';

describe('endless stream', () => {
	test('generates at least initial batch size measures', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			endlessInitialBatch: 10,
		});
		const round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'eighths',
			settings,
			seed: 42,
		});
		expect(round.measures.length).toBeGreaterThanOrEqual(10);
	});

	test('default prefetch remaining is 3', () => {
		expect(DEFAULT_SETTINGS.endlessPrefetchRemaining).toBe(3);
	});

	test('injects poison into the stream when poison is enabled', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'hidden',
			endlessInitialBatch: 24,
		});
		const round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'eighths',
			settings,
			seed: 7,
		});
		const poisonHits = round.measures.filter((m) =>
			richMeasuresEqual(m, round.poisonMeasure),
		);
		expect(poisonHits.length).toBeGreaterThan(0);
		expect(round.poisonIndex).toBeGreaterThanOrEqual(0);
		expect(
			richMeasuresEqual(round.measures[round.poisonIndex], round.poisonMeasure),
		).toBe(true);
	});

	test('never ends the initial batch on poison', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'hidden',
			endlessInitialBatch: 24,
		});
		for (let seed = 0; seed < 40; seed += 1) {
			const round = generateRound({
				difficulty: 3,
				subdivisionLevel: 'eighths',
				settings,
				seed,
			});
			if (round.poisonIndex < 0) continue;
			expect(round.poisonIndex).toBeLessThan(round.measures.length - 1);
			expect(
				richMeasuresEqual(
					round.measures[round.measures.length - 1],
					round.poisonMeasure,
				),
			).toBe(false);
		}
	});

	test('skips poison injection when poison mode is off', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'off',
			endlessInitialBatch: 16,
		});
		const round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'eighths',
			settings,
			seed: 7,
		});
		expect(
			round.measures.some((m) => richMeasuresEqual(m, round.poisonMeasure)),
		).toBe(false);
		expect(round.poisonIndex).toBe(-1);
	});

	test('append batch can include poison but never ends on it', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'hidden',
			endlessInitialBatch: 4,
		});
		const round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'eighths',
			settings,
			seed: 11,
		});
		const appended = generateAppendBatch(
			{
				difficulty: 3,
				subdivisionLevel: 'eighths',
				settings,
				seed: round.seed,
			},
			round.measures,
			round.poisonMeasure,
			round.seed,
			20,
		);
		expect(appended.length).toBeGreaterThanOrEqual(20);
		expect(
			appended.some((m) => richMeasuresEqual(m, round.poisonMeasure)),
		).toBe(true);
		expect(
			richMeasuresEqual(appended[appended.length - 1], round.poisonMeasure),
		).toBe(false);
	});

	test('append batch does not become mostly poison over a long stream', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'hidden',
			endlessInitialBatch: 8,
		});
		const round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'eighths',
			settings,
			seed: 99,
		});
		let stream = [...round.measures];
		for (let batch = 0; batch < 8; batch += 1) {
			const appended = generateAppendBatch(
				{
					difficulty: 3,
					subdivisionLevel: 'eighths',
					settings,
					seed: round.seed,
				},
				stream,
				round.poisonMeasure,
				round.seed,
				8,
			);
			stream = stream.concat(appended);
		}

		const poisonHits = stream.filter((m) =>
			richMeasuresEqual(m, round.poisonMeasure),
		);
		expect(poisonHits.length).toBeLessThan(stream.length * 0.45);

		let maxRun = 0;
		let run = 0;
		for (const measure of stream) {
			if (richMeasuresEqual(measure, round.poisonMeasure)) {
				run += 1;
				maxRun = Math.max(maxRun, run);
			} else {
				run = 0;
			}
		}
		expect(maxRun).toBeLessThanOrEqual(1);
	});
});
