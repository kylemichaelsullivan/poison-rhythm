import type { SubdivisionLevel } from './preference-schemas';

export const SUBDIVISION_LEVELS: SubdivisionLevel[] = [
	'quarters',
	'eighths',
	'sixteenths',
];

export const SUBDIVISION_LABELS = ['1/4', '1/8', '1/16'] as const;

/** Prose names for toast / settings copy (paired with SUBDIVISION_LEVELS). */
export const SUBDIVISION_PROSE_LABELS: Record<SubdivisionLevel, string> = {
	quarters: 'Quarter Notes',
	eighths: 'Eighth Notes',
	sixteenths: 'Sixteenth Notes',
};

export function levelToIndex(level: SubdivisionLevel): number {
	return SUBDIVISION_LEVELS.indexOf(level);
}

export function indexToLevel(i: number): SubdivisionLevel {
	return SUBDIVISION_LEVELS[Math.max(0, Math.min(i, 2))];
}
