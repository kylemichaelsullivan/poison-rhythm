import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { GameSettings } from '@/lib/settings-schema';
import type { LegacyRhythmMeasure, RichRhythmMeasure } from '@/types';
import {
	legacyToRichMeasure,
	MEASURE_LENGTH,
	richToLegacyMeasure,
} from '@/types';
import { hitRangeForLevel } from './difficulty-levels';
import { generateMeasure as generateRichMeasure } from './rhythm/generate-measure';

export const QUARTER_NOTES: LegacyRhythmMeasure = [
	true,
	false,
	true,
	false,
	true,
	false,
	true,
	false,
	true,
	false,
	true,
	false,
	true,
	false,
	true,
	false,
];

const DOWN_BEATS = [0, 4, 8, 12];
const UP_BEATS = [2, 6, 10, 14];
const E_BEATS = [1, 5, 9, 13];
const A_BEATS = [3, 7, 11, 15];
const WEAK_BEATS = [...UP_BEATS, ...E_BEATS, ...A_BEATS];
const ALL_BEATS = [...DOWN_BEATS, ...WEAK_BEATS];

const rand = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

function pickRandom<T>(arr: readonly T[], count: number): T[] {
	const copy = [...arr].sort(() => Math.random() - 0.5);
	return copy.slice(0, count);
}

function measureWithHitsAt(indices: number[]): LegacyRhythmMeasure {
	const m = new Array(MEASURE_LENGTH).fill(false) as LegacyRhythmMeasure;
	for (const i of indices) m[i] = true;
	return m;
}

function pickIndices(difficulty: number, hits: number): number[] {
	if (difficulty === 1) return pickRandom(DOWN_BEATS, hits);
	if (difficulty >= 4) return pickRandom(ALL_BEATS, hits);

	const strongCount =
		difficulty === 2
			? Math.max(1, hits - rand(0, 2))
			: rand(Math.floor(hits / 2), Math.min(hits, 4));
	const weakCount = hits - strongCount;
	return [
		...pickRandom(DOWN_BEATS, strongCount),
		...pickRandom(WEAK_BEATS, weakCount),
	];
}

/** Legacy generator; prefer generateMeasure from rhythm engine for rich measures. */
export function generateRandomMeasure(difficulty = 3): LegacyRhythmMeasure {
	const [minHits, maxHits] = hitRangeForLevel(difficulty);
	const hits = rand(minHits, maxHits);
	return measureWithHitsAt(pickIndices(difficulty, hits));
}

export function generateRandomRichMeasure(
	difficulty: number,
	subdivisionLevel: SubdivisionLevel,
	settings: GameSettings,
	seed?: number,
): RichRhythmMeasure {
	return generateRichMeasure({
		difficulty,
		subdivisionLevel,
		settings,
		seed: seed ?? Math.floor(Math.random() * 2 ** 31),
	});
}

export function richMeasureToLegacy(
	measure: RichRhythmMeasure,
): LegacyRhythmMeasure {
	return richToLegacyMeasure(measure);
}

export function legacyMeasureToRich(
	measure: LegacyRhythmMeasure,
): RichRhythmMeasure {
	return legacyToRichMeasure(measure);
}
