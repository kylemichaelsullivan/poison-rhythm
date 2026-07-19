import { describe, expect, test } from 'bun:test';
import {
	clampTempo,
	decrementTempoByStep,
	incrementTempoByStep,
} from '../metronome-tempo';

describe('metronome-tempo', () => {
	test('clamps tempo to the supported range', () => {
		expect(clampTempo(20)).toBe(40);
		expect(clampTempo(400)).toBe(300);
		expect(clampTempo(120)).toBe(120);
	});

	test('steps tempo by five toward nearest multiples', () => {
		expect(decrementTempoByStep(123)).toBe(120);
		expect(incrementTempoByStep(123)).toBe(125);
		expect(decrementTempoByStep(120)).toBe(115);
		expect(incrementTempoByStep(120)).toBe(125);
	});
});
