import { MEASURE_LENGTH, type RhythmMeasure } from '@/types/rhythm';

export function rhythmsEqual(a: RhythmMeasure, b: RhythmMeasure): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

export function isValidRhythm(r: unknown): r is RhythmMeasure {
	if (!Array.isArray(r) || r.length !== MEASURE_LENGTH) return false;
	return r.every((x) => typeof x === 'boolean');
}

export function countHits(r: RhythmMeasure): number {
	return r.filter(Boolean).length;
}
