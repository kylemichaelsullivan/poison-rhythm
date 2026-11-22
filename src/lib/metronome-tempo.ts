import {
	BPM_BUTTON_STEP,
	BPM_MAX,
	BPM_MIN,
	BPM_TICK_INTERVAL,
} from './metronome-defaults';

export function clampTempo(
	value: number,
	min: number = BPM_MIN,
	max: number = BPM_MAX,
) {
	const lo = Math.min(Math.max(min, BPM_MIN), BPM_MAX);
	const hi = Math.min(Math.max(max, BPM_MIN), BPM_MAX);
	const floor = Math.min(lo, hi);
	const ceiling = Math.max(lo, hi);
	return Math.min(ceiling, Math.max(floor, value));
}

/** Keep min ≤ max and both inside global BPM bounds. */
export function normalizeTempoLimits(
	tempoMin: number,
	tempoMax: number,
): { tempoMin: number; tempoMax: number } {
	const lo = clampTempo(tempoMin, BPM_MIN, BPM_MAX);
	const hi = clampTempo(tempoMax, BPM_MIN, BPM_MAX);
	if (lo <= hi) {
		return { tempoMin: lo, tempoMax: hi };
	}
	return { tempoMin: hi, tempoMax: lo };
}

/** Endpoints plus every multiple of `interval` strictly inside `[min, max]`. */
export function tempoTickValues(
	min = BPM_MIN,
	max = BPM_MAX,
	interval = BPM_TICK_INTERVAL,
): number[] {
	const ticks = new Set<number>([min, max]);
	const first = Math.ceil(min / interval) * interval;
	for (let tick = first; tick < max; tick += interval) {
		if (tick > min) {
			ticks.add(tick);
		}
	}
	return [...ticks].sort((a, b) => a - b);
}

export function decrementTempoByStep(current: number) {
	if (current % BPM_BUTTON_STEP === 0) {
		return current - BPM_BUTTON_STEP;
	}

	return Math.floor(current / BPM_BUTTON_STEP) * BPM_BUTTON_STEP;
}

export function incrementTempoByStep(current: number) {
	if (current % BPM_BUTTON_STEP === 0) {
		return current + BPM_BUTTON_STEP;
	}

	return Math.ceil(current / BPM_BUTTON_STEP) * BPM_BUTTON_STEP;
}

export { resolveInitialTempo as getInitialTempo } from './preference-storage';
