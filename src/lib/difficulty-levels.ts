import { allowedIndicesForSubdivisionLevel } from '@/lib/rhythm/grid';
import type { SubdivisionLevel } from '@/lib/preference-schemas';

export type HitRange = readonly [min: number, max: number];

export type DifficultyLevelHits = Record<SubdivisionLevel, HitRange>;

export type DifficultyLevel = {
	readonly hits: DifficultyLevelHits;
};

/** Reference slot count for sixteenths (longest grid). */
export const HIT_RANGE_REFERENCE_SLOTS = 16;

/**
 * Hardcoded hit ranges per Show Notes subdivision (used by generation + help).
 * Placement is separate — see {@link difficultyPlacementHelp}.
 */
export const DIFFICULTY_LEVELS = [
	{
		hits: {
			sixteenths: [2, 4],
			eighths: [1, 2],
			quarters: [1, 2],
		},
	},
	{
		hits: {
			sixteenths: [4, 6],
			eighths: [2, 3],
			quarters: [2, 3],
		},
	},
	{
		hits: {
			sixteenths: [6, 8],
			eighths: [3, 4],
			quarters: [2, 3],
		},
	},
	{
		hits: {
			sixteenths: [8, 10],
			eighths: [4, 5],
			quarters: [3, 4],
		},
	},
	{
		hits: {
			sixteenths: [10, 14],
			eighths: [5, 7],
			quarters: [3, 4],
		},
	},
] as const satisfies readonly DifficultyLevel[];

export type DifficultyLevelEntry = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = DIFFICULTY_LEVELS.length;

export function allowedSlotsForSubdivision(
	subdivisionLevel: SubdivisionLevel,
): number {
	return allowedIndicesForSubdivisionLevel(subdivisionLevel).length;
}

/** Map an allowed-slot count (from the active grid) onto a Show Notes level. */
export function subdivisionForSlotCount(
	allowedSlots: number,
): SubdivisionLevel {
	if (allowedSlots <= 4) return 'quarters';
	if (allowedSlots <= 8) return 'eighths';
	return 'sixteenths';
}

export function hitRangeForLevel(
	level: number,
	allowedSlots: number = HIT_RANGE_REFERENCE_SLOTS,
): HitRange {
	const i = Math.max(0, Math.min(level - 1, DIFFICULTY_LEVELS.length - 1));
	const subdivision = subdivisionForSlotCount(allowedSlots);
	return DIFFICULTY_LEVELS[i].hits[subdivision];
}

/**
 * Placement copy for help UI — mirrors `pickHitIndices`.
 * Quarters only allow downbeats, so placement bias has nothing to say.
 */
export function difficultyPlacementHelp(
	level: number,
	subdivisionLevel: SubdivisionLevel,
): string | null {
	if (subdivisionLevel === 'quarters') {
		return null;
	}

	switch (level) {
		case 1:
			return 'downbeats only';
		case 2:
			return 'mostly downbeats';
		case 3:
			return 'some offbeats';
		case 4:
		case 5:
			return 'any beat';
		default:
			return null;
	}
}

function formatHitCount(min: number, max: number): string {
	if (min === max) {
		return min === 1 ? '1 hit' : `${min} hits`;
	}
	return `${min}–${max} hits`;
}

export function formatDifficultyHelpText(
	level: number,
	subdivisionLevel: SubdivisionLevel = 'sixteenths',
): string {
	const i = Math.max(0, Math.min(level - 1, DIFFICULTY_LEVELS.length - 1));
	const [min, max] = DIFFICULTY_LEVELS[i].hits[subdivisionLevel];
	const hits = formatHitCount(min, max);
	const placement = difficultyPlacementHelp(level, subdivisionLevel);
	return placement ? `${hits} — ${placement}` : hits;
}
