export type HitRange = readonly [min: number, max: number];

export type DifficultyLevel = {
	readonly hits: HitRange;
	readonly summary: string;
	readonly description: string;
};

/** Hit ranges below are calibrated for a full sixteenth-note grid. */
export const HIT_RANGE_REFERENCE_SLOTS = 16;

export const DIFFICULTY_LEVELS = [
	{
		hits: [2, 4],
		summary: 'Fewest hits',
		description: 'only on the downbeats.',
	},
	{
		hits: [4, 6],
		summary: 'More hits',
		description: 'mostly downbeats with a few offbeats.',
	},
	{
		hits: [6, 8],
		summary: 'Busier patterns',
		description: 'mixing downbeats and weaker subdivisions.',
	},
	{
		hits: [8, 10],
		summary: 'Dense patterns',
		description: 'landing freely across the available grid.',
	},
	{
		hits: [10, 14],
		summary: 'Densest patterns',
		description: 'nearly filling the measure.',
	},
] as const satisfies readonly DifficultyLevel[];

export type DifficultyLevelEntry = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = DIFFICULTY_LEVELS.length;

/** Scale sixteenth-calibrated hit counts onto a coarser subdivision grid. */
export function scaleHitRange(
	range: HitRange,
	allowedSlots: number,
	referenceSlots: number = HIT_RANGE_REFERENCE_SLOTS,
): HitRange {
	if (allowedSlots <= 0) return [0, 0];
	if (allowedSlots === referenceSlots) return range;

	const scale = allowedSlots / referenceSlots;
	let min = Math.round(range[0] * scale);
	let max = Math.round(range[1] * scale);

	min = Math.max(1, Math.min(min, allowedSlots));
	max = Math.max(min, Math.min(max, allowedSlots));
	return [min, max];
}

export function hitRangeForLevel(
	level: number,
	allowedSlots: number = HIT_RANGE_REFERENCE_SLOTS,
): HitRange {
	const i = Math.max(0, Math.min(level - 1, DIFFICULTY_LEVELS.length - 1));
	return scaleHitRange(DIFFICULTY_LEVELS[i].hits, allowedSlots);
}

export function formatDifficultyHelpText(entry: DifficultyLevelEntry): string {
	const [min, max] = entry.hits;
	return `${entry.summary} (${min}–${max} on 1/16; scales with subdivision), ${entry.description}`;
}
