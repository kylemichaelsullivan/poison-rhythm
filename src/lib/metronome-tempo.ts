import { BPM_BUTTON_STEP, BPM_MAX, BPM_MIN } from './metronome-defaults';

export function clampTempo(value: number) {
	return Math.min(BPM_MAX, Math.max(BPM_MIN, value));
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
