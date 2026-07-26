import type { SubdivisionLevel } from '@/contexts';
import { MEASURE_LENGTH, type RhythmMeasure } from '@/types';

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
