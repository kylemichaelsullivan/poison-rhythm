export type HitRange = readonly [min: number, max: number];

export type DifficultyLevel = {
	readonly hits: HitRange;
	readonly summary: string;
	readonly description: string;
};

export const DIFFICULTY_LEVELS = [
	{
		hits: [2, 4],
		summary: 'Fewest hits',
		description: 'only on the downbeats (1, 2, 3, 4).',
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
		description: 'landing freely across the sixteenth-note grid.',
	},
	{
		hits: [10, 14],
		summary: 'Densest patterns',
		description: 'nearly filling the measure with sixteenth-note hits.',
	},
] as const satisfies readonly DifficultyLevel[];

export type DifficultyLevelEntry = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = DIFFICULTY_LEVELS.length;

export function hitRangeForLevel(level: number): HitRange {
	const i = Math.max(0, Math.min(level - 1, DIFFICULTY_LEVELS.length - 1));
	return DIFFICULTY_LEVELS[i].hits;
}

export function formatDifficultyHelpText(entry: DifficultyLevelEntry): string {
	const [min, max] = entry.hits;
	return `${entry.summary} (${min}–${max}), ${entry.description}`;
}
