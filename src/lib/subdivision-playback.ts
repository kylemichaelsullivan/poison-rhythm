import { MEASURE_LENGTH, type RhythmMeasure } from '@/types';
import type { SubdivisionLevel } from './preference-schemas';

/** Horizontal position (0–100) for a subdivision step within the measure. */
export function subdivisionPositionPercent(
	stepIndex: number,
	level: SubdivisionLevel,
): number {
	const stepCount = subdivisionStepCount(level);
	return ((stepIndex + 0.5) / stepCount) * 100;
}

/** Seconds between subdivision pulses at the given tempo. */
export function subdivisionPulseSec(
	tempo: number,
	level: SubdivisionLevel,
): number {
	return 60 / tempo / subdivisionPulseDivisor(level);
}

/** Milliseconds between subdivision pulses at the given tempo. */
export function subdivisionPulseMs(
	tempo: number,
	level: SubdivisionLevel,
): number {
	return subdivisionPulseSec(tempo, level) * 1000;
}

/** Smooth playhead position (0–100) for a fractional subdivision step. */
export function smoothSubdivisionPositionPercent(
	step: number,
	level: SubdivisionLevel,
): number {
	const stepCount = subdivisionStepCount(level);
	const clamped = Math.min(Math.max(step, 0), stepCount - 0.5);
	return ((clamped + 0.5) / stepCount) * 100;
}

/** Horizontal position (0–100) for a grid cell within the measure. */
export function cellPositionPercent(
	cellIndex: number,
	spanCells: number = MEASURE_LENGTH,
): number {
	return ((cellIndex + 0.5) / spanCells) * 100;
}

export function subdivisionStepCount(level: SubdivisionLevel): number {
	switch (level) {
		case 'quarters':
			return 4;
		case 'eighths':
			return 8;
		case 'sixteenths':
			return MEASURE_LENGTH;
	}
}

export function subdivisionPulseDivisor(level: SubdivisionLevel): number {
	switch (level) {
		case 'quarters':
			return 1;
		case 'eighths':
			return 2;
		case 'sixteenths':
			return 4;
	}
}

export function cellToSubdivisionStep(
	level: SubdivisionLevel,
	cellIndex: number,
): number {
	switch (level) {
		case 'quarters':
			return cellIndex / 4;
		case 'eighths':
			return cellIndex / 2;
		case 'sixteenths':
			return cellIndex;
	}
}

export function isQuarterDownbeat(
	level: SubdivisionLevel,
	stepIndex: number,
): boolean {
	switch (level) {
		case 'quarters':
			return true;
		case 'eighths':
			return stepIndex % 2 === 0;
		case 'sixteenths':
			return stepIndex % 4 === 0;
	}
}

export function stepHasHit(
	measure: RhythmMeasure,
	level: SubdivisionLevel,
	stepIndex: number,
): boolean {
	for (let i = 0; i < measure.length; i++) {
		if (cellToSubdivisionStep(level, i) === stepIndex && measure[i]) {
			return true;
		}
	}
	return false;
}
