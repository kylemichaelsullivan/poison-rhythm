import type { PoisonMode } from '@/lib/settings-schema';
import type { RichRhythmMeasure } from '@/types';
import { createEmptyRichMeasure } from '@/types';
import type { PRNG } from './prng';

/** Base per-measure rate before difficulty scaling (former “normal” frequency). */
const BASE_POISON_RATE = 0.16;

/**
 * Higher difficulty → lower poison chance (busier decoys already stress timing).
 * Difficulty 1 ≈ 1.0, difficulty 5 ≈ 0.36.
 */
export function difficultyPoisonScale(difficulty: number): number {
	const level = Math.max(1, Math.min(5, Math.round(difficulty)));
	return Math.max(0.3, 1.15 - level * 0.16);
}

export function poisonBaseRate(difficulty: number): number {
	return BASE_POISON_RATE * difficultyPoisonScale(difficulty);
}

/**
 * Classic mode: cumulative chance that rises with index (until first poison).
 * Endless / stationary: constant per-measure rate (does not grow with stream length).
 */
export function poisonProbability(
	measureIndex: number,
	difficulty: number = 3,
	options?: { stationary?: boolean },
): number {
	const base = poisonBaseRate(difficulty);
	if (options?.stationary) {
		return base;
	}
	if (measureIndex <= 0) return 0;
	return 1 - (1 - base) ** measureIndex;
}

/** Always show the poison reference (Visible). Hidden conceals it during playback. */
export function isPoisonVisible(mode: PoisonMode): boolean {
	return mode === 'visible';
}

/** Hide the poison reference during student playback (Not / Hidden). */
export function shouldHidePoisonDuringPlayback(mode: PoisonMode): boolean {
	return mode === 'hidden';
}

export function shouldInjectPoison(
	mode: PoisonMode,
	measureIndex: number,
	rng: PRNG,
	difficulty: number = 3,
	options?: { stationary?: boolean },
): boolean {
	if (mode === 'off') return false;
	if (!options?.stationary && measureIndex <= 0) return false;
	return rng.next() < poisonProbability(measureIndex, difficulty, options);
}

export function createPoisonMeasure(
	source: RichRhythmMeasure,
	mode: PoisonMode,
): RichRhythmMeasure {
	if (mode === 'off') {
		return createEmptyRichMeasure();
	}
	return source.map((step) => ({ ...step }));
}

export function injectPoisonCell(
	measure: RichRhythmMeasure,
	rng: PRNG,
): RichRhythmMeasure {
	const hitIndices = measure.filter((s) => s.hit).map((s) => s.index);
	if (hitIndices.length === 0) {
		const idx = rng.nextInt(0, 15);
		const copy = measure.map((s) => ({ ...s }));
		copy[idx].hit = true;
		return copy;
	}

	const targetIdx = rng.pick(hitIndices);
	const copy = measure.map((s) => ({ ...s }));
	copy[targetIdx].hit = !copy[targetIdx].hit;
	return copy;
}
