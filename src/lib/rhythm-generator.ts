import { MEASURE_LENGTH, type RhythmMeasure } from '@/types/rhythm';

export const QUARTER_NOTES: RhythmMeasure = [
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

const HIT_RANGES: ReadonlyArray<[min: number, max: number]> = [
	[2, 4],
	[4, 6],
	[6, 8],
	[8, 10],
	[10, 14],
];

const rand = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

function pickRandom<T>(arr: readonly T[], count: number): T[] {
	const copy = [...arr].sort(() => Math.random() - 0.5);
	return copy.slice(0, count);
}

function measureWithHitsAt(indices: number[]): RhythmMeasure {
	const m = new Array(MEASURE_LENGTH).fill(false) as RhythmMeasure;
	for (const i of indices) m[i] = true;
	return m;
}

function hitRange(difficulty: number): [number, number] {
	const i = Math.max(0, Math.min(difficulty - 1, HIT_RANGES.length - 1));
	return [...HIT_RANGES[i]];
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

export function generateRandomMeasure(difficulty = 3): RhythmMeasure {
	const [minHits, maxHits] = hitRange(difficulty);
	const hits = rand(minHits, maxHits);
	return measureWithHitsAt(pickIndices(difficulty, hits));
}
