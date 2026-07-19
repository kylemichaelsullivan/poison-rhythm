import { describe, expect, test } from 'bun:test';
import {
	cellToSubdivisionStep,
	isQuarterDownbeat,
	subdivisionPulseDivisor,
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
});
