import { describe, expect, test } from 'bun:test';
import {
	cellToSubdivisionStep,
	isQuarterDownbeat,
	smoothSubdivisionPositionPercent,
	stepHasHit,
	subdivisionPositionPercent,
	subdivisionPulseDivisor,
	subdivisionPulseMs,
	subdivisionPulseSec,
	subdivisionStepCount,
} from '../subdivision-playback';

describe('subdivision-playback', () => {
	test('maps subdivision levels to step counts and pulse divisors', () => {
		expect(subdivisionStepCount('quarters')).toBe(4);
		expect(subdivisionStepCount('eighths')).toBe(8);
		expect(subdivisionStepCount('sixteenths')).toBe(16);
		expect(subdivisionPulseDivisor('quarters')).toBe(1);
		expect(subdivisionPulseDivisor('eighths')).toBe(2);
		expect(subdivisionPulseDivisor('sixteenths')).toBe(4);
	});

	test('converts cells and identifies quarter downbeats', () => {
		expect(cellToSubdivisionStep('eighths', 6)).toBe(3);
		expect(isQuarterDownbeat('sixteenths', 8)).toBe(true);
		expect(isQuarterDownbeat('eighths', 1)).toBe(false);
	});

	test('computes pulse duration and smooth playhead positions', () => {
		expect(subdivisionPulseMs(120, 'quarters')).toBe(500);
		expect(subdivisionPulseMs(120, 'eighths')).toBe(250);
		expect(subdivisionPulseMs(120, 'sixteenths')).toBe(125);
		expect(subdivisionPulseSec(120, 'sixteenths')).toBe(0.125);

		expect(smoothSubdivisionPositionPercent(0, 'eighths')).toBe(
			subdivisionPositionPercent(0, 'eighths'),
		);
		expect(smoothSubdivisionPositionPercent(4.5, 'eighths')).toBe(
			subdivisionPositionPercent(4, 'eighths') +
				(subdivisionPositionPercent(5, 'eighths') -
					subdivisionPositionPercent(4, 'eighths')) /
					2,
		);
		expect(smoothSubdivisionPositionPercent(7, 'eighths')).toBe(
			subdivisionPositionPercent(7, 'eighths'),
		);
	});

	test('detects hits at the current subdivision step', () => {
		const measure = Array.from({ length: 16 }, () => false);
		measure[6] = true;
		measure[4] = true;

		expect(stepHasHit(measure, 'sixteenths', 6)).toBe(true);
		expect(stepHasHit(measure, 'sixteenths', 5)).toBe(false);
		expect(stepHasHit(measure, 'eighths', 3)).toBe(true);
		expect(stepHasHit(measure, 'quarters', 1)).toBe(true);
		expect(stepHasHit(measure, 'quarters', 0)).toBe(false);
	});
});
