import { createPlaybackClock } from './playback-clock';

export type CountInPlan = {
	/** AudioContext times for each count-in click. */
	beatTimes: number[];
	/** AudioContext time when measure playback should begin (one quarter after the last click). */
	playbackAt: number;
};

/**
 * Plan a one-bar quarter-note count-in on the audio clock.
 * Beats are equally spaced at `tempo` BPM; playback starts on the following downbeat.
 */
export function planCountIn(
	tempo: number,
	audioNow: number,
	options?: { beatCount?: number; leadSec?: number },
): CountInPlan {
	const clock = createPlaybackClock({
		tempo,
		subdivisionLevel: 'quarters',
		countInEnabled: true,
		audioNow,
		leadSec: options?.leadSec,
		beatCount: options?.beatCount,
	});

	return {
		beatTimes: clock.countInBeatTimes,
		playbackAt: clock.firstPlaybackAt,
	};
}
