import {
	BPM_BUTTON_STEP,
	BPM_MAX,
	BPM_MIN,
	BPM_TICK_INTERVAL,
} from './metronome-defaults';

export function clampTempo(value: number) {
	return Math.min(BPM_MAX, Math.max(BPM_MIN, value));
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
