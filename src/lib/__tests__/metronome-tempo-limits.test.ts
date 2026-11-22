import { describe, expect, test } from 'bun:test';
import { BPM_MAX, BPM_MIN } from '../metronome-defaults';
import { clampTempo, normalizeTempoLimits } from '../metronome-tempo';

describe('tempo limits', () => {
	test('clampTempo respects custom min and max', () => {
		expect(clampTempo(40, 60, 140)).toBe(60);
		expect(clampTempo(180, 60, 140)).toBe(140);
		expect(clampTempo(100, 60, 140)).toBe(100);
	});

	test('normalizeTempoLimits swaps inverted bounds', () => {
		expect(normalizeTempoLimits(160, 80)).toEqual({
			tempoMin: 80,
			tempoMax: 160,
		});
	});

	test('normalizeTempoLimits stays inside global BPM bounds', () => {
		expect(normalizeTempoLimits(BPM_MIN - 10, BPM_MAX + 10)).toEqual({
			tempoMin: BPM_MIN,
			tempoMax: BPM_MAX,
		});
	});
});
