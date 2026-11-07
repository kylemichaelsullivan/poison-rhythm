import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { onMeasureCompleteForMode } from '@/lib/game-modes';
import {
	POISON_HIT_BOTTLE_HOLD_MS,
	POISON_HIT_DURATION_MS,
	POISON_HIT_FADE_OUT_MS,
	POISON_HIT_SPLAT_MS,
	POISON_HIT_TITLE,
} from '@/lib/poison-hit';
import { generateRound } from '@/lib/rhythm';
import { DEFAULT_SETTINGS, sanitizeGameSettings } from '@/lib/settings-schema';

describe('poison-hit', () => {
	test('title and explode timing stay in sync for the overlay', () => {
		expect(POISON_HIT_TITLE).toBe('That’s the Poison!');
		expect(POISON_HIT_DURATION_MS).toBe(
			POISON_HIT_BOTTLE_HOLD_MS + POISON_HIT_SPLAT_MS + POISON_HIT_FADE_OUT_MS,
		);
		expect(POISON_HIT_BOTTLE_HOLD_MS).toBe(650);
		expect(POISON_HIT_SPLAT_MS).toBe(750);
		expect(POISON_HIT_FADE_OUT_MS).toBe(400);
	});

	test('stylesheet animates the bottle explode and respects reduced motion', () => {
		const css = readFileSync(
			join(import.meta.dir, '../../../src/index.css'),
			'utf8',
		);
		expect(css).toContain('poison-hit-bottle');
		expect(css).toContain('poison-hit-overlay-clear');
		expect(css).toContain('.PoisonHitBottle');
		expect(css).toContain('@media (prefers-reduced-motion: reduce)');
		const reduceBlock = css.slice(
			css.lastIndexOf('@media (prefers-reduced-motion: reduce)'),
		);
		expect(reduceBlock).toContain('.PoisonHitBottle');
		expect(reduceBlock).toContain('.PoisonHitSplatBlob');
		expect(reduceBlock).toContain('animation: none');
	});

	test('classic poison measure stop carries a poison hint', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: false,
			poisonMode: 'visible',
			gameMode: 'default',
		});
		let round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'quarters',
			settings,
			seed: 0,
		});
		for (let seed = 1; seed < 80 && round.poisonIndex < 0; seed += 1) {
			round = generateRound({
				difficulty: 3,
				subdivisionLevel: 'quarters',
				settings,
				seed,
			});
		}
		expect(round.poisonIndex).toBeGreaterThanOrEqual(0);

		const result = onMeasureCompleteForMode(
			{ difficulty: 3, subdivisionLevel: 'quarters', settings, roundNumber: 1 },
			round,
			round.poisonIndex,
		);
		expect(result.shouldStop).toBe(true);
		expect(result.visualHints).toEqual([{ type: 'poison' }]);
	});

	test('endless continuous play does not stop on poison', () => {
		const settings = sanitizeGameSettings({
			...DEFAULT_SETTINGS,
			endless: true,
			poisonMode: 'visible',
			gameMode: 'default',
			endlessInitialBatch: 16,
		});
		let round = generateRound({
			difficulty: 3,
			subdivisionLevel: 'quarters',
			settings,
			seed: 0,
		});
		for (let seed = 1; seed < 80 && round.poisonIndex < 0; seed += 1) {
			round = generateRound({
				difficulty: 3,
				subdivisionLevel: 'quarters',
				settings,
				seed,
			});
		}
		expect(round.poisonIndex).toBeGreaterThanOrEqual(0);

		const result = onMeasureCompleteForMode(
			{ difficulty: 3, subdivisionLevel: 'quarters', settings, roundNumber: 1 },
			round,
			round.poisonIndex,
		);
		expect(result.shouldStop).toBe(false);
	});
});
