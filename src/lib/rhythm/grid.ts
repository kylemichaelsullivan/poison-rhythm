import type { SubdivisionLevel } from '@/lib/preference-schemas';
import { MEASURE_LENGTH } from '@/types';

export const DOWN_BEATS = [0, 4, 8, 12];
export const UP_BEATS = [2, 6, 10, 14];
export const E_BEATS = [1, 5, 9, 13];
export const A_BEATS = [3, 7, 11, 15];
export const WEAK_BEATS = [...UP_BEATS, ...E_BEATS, ...A_BEATS];
export const ALL_BEATS = [...DOWN_BEATS, ...WEAK_BEATS];

export function allowedIndicesForSubdivisionLevel(
	level: SubdivisionLevel,
): number[] {
	switch (level) {
		case 'quarters':
			return DOWN_BEATS;
		case 'eighths':
			return [...DOWN_BEATS, ...UP_BEATS];
		case 'sixteenths':
			return ALL_BEATS;
	}
}

export function isOffBeat(index: number): boolean {
	return !DOWN_BEATS.includes(index);
}

export function isStrongBeat(index: number): boolean {
	return DOWN_BEATS.includes(index);
}

export function measureLength(): number {
	return MEASURE_LENGTH;
}
