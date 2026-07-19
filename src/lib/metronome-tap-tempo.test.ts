import { describe, expect, test } from 'bun:test';
import { applyTapTempo } from './metronome-tap-tempo';

describe('metronome-tap-tempo', () => {
	test('averages recent taps into a tempo', () => {
		let tempo = 0;
		const retained = applyTapTempo([0, 500, 1000], (value) => {
			tempo = value;
		});

		expect(tempo).toBe(120);
		expect(retained).toEqual([0, 500, 1000]);
	});

	test('resets when the gap between taps is too large', () => {
		expect(applyTapTempo([0, 1500], () => {})).toEqual([]);
	});
});
