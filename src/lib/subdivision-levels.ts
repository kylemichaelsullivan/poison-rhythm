import type { SubdivisionLevel } from '@/contexts';

export const SUBDIVISION_LEVELS: SubdivisionLevel[] = [
	'quarters',
	'eighths',
	'sixteenths',
];

export const SUBDIVISION_LABELS = ['1/4', '1/8', '1/16'] as const;

export function levelToIndex(level: SubdivisionLevel): number {
	return SUBDIVISION_LEVELS.indexOf(level);
}

export function indexToLevel(i: number): SubdivisionLevel {
	return SUBDIVISION_LEVELS[Math.max(0, Math.min(i, 2))];
}
