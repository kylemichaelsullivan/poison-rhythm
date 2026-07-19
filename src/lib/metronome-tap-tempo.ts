import { TAP_RESET_MS, TAP_SAMPLE_COUNT } from './metronome-defaults';
import { clampTempo } from './metronome-tempo';

export function applyTapTempo(
	taps: number[],
	setTempo: (value: number) => void,
): number[] {
	const trimmedTaps = taps.slice(-TAP_SAMPLE_COUNT);

	if (trimmedTaps.length < 2) {
		return trimmedTaps;
	}

	const diffs: number[] = [];

	for (let i = 0; i < trimmedTaps.length - 1; i++) {
		const diff = trimmedTaps[i + 1] - trimmedTaps[i];

		if (diff > TAP_RESET_MS) {
			return [];
		}

		diffs.push(diff);
	}

	const recentDiffs = diffs.slice(-2);
	const averageInterval =
		recentDiffs.reduce((total, value) => total + value, 0) / recentDiffs.length;

	setTempo(clampTempo(Math.round(60000 / averageInterval)));

	return trimmedTaps;
}
