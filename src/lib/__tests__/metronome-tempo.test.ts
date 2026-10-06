import { describe, expect, test } from 'bun:test';
import { BPM_MAX, BPM_MIN, BPM_TICK_INTERVAL } from '../metronome-defaults';
import {
	clampTempo,
	decrementTempoByStep,
	incrementTempoByStep,
	tempoTickValues,
} from '../metronome-tempo';

describe('metronome-tempo', () => {
	test('clamps tempo to the supported range', () => {
		expect(clampTempo(20)).toBe(BPM_MIN);
		expect(clampTempo(400)).toBe(BPM_MAX);
		expect(clampTempo(120)).toBe(120);
	});

	test('steps tempo by five toward nearest multiples', () => {
		expect(decrementTempoByStep(123)).toBe(120);
		expect(incrementTempoByStep(123)).toBe(125);
		expect(decrementTempoByStep(120)).toBe(115);
		expect(incrementTempoByStep(120)).toBe(125);
	});

	test('builds tick values at endpoints and every tick interval', () => {
		expect(BPM_TICK_INTERVAL).toBe(50);
		expect(tempoTickValues()).toEqual([50, 100, 150, 200]);
	});
});
