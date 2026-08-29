import type { RhythmMeasure } from '@/types';

export type PlaybackSource = 'metronome' | 'measures';
export type PlaybackPass = 'demo' | 'student';

/**
 * True only while a demo or student pass is actively advancing steps.
 * False during count-in and in the brief window before count-in state is set.
 */
export function isMeasuresPlaying(options: {
	activeSource: PlaybackSource | null;
	isCountingIn: boolean;
	playbackPass: PlaybackPass | null;
}): boolean {
	return (
		options.activeSource === 'measures' &&
		!options.isCountingIn &&
		options.playbackPass !== null
	);
}

/** Whether the measure grid should ring the cell for the current subdivision step. */
export function shouldHighlightPlaybackStep(options: {
	playbackEnabled: boolean;
	isMeasuresPlaying: boolean;
	cellStep: number;
	subdivisionIndex: number;
	showVisual: boolean;
}): boolean {
	return (
		options.playbackEnabled &&
		options.isMeasuresPlaying &&
		options.showVisual &&
		options.cellStep === options.subdivisionIndex
	);
}

/** Which pass follows count-in (or immediate start when count-in is off). */
export function initialPlaybackPass(demoBeforePlay: boolean): PlaybackPass {
	return demoBeforePlay ? 'demo' : 'student';
}

/** Both passes use the current carousel measure (listen, then play). */
export function measureForPlaybackPass(
	_pass: PlaybackPass,
	_previewMeasure: RhythmMeasure | null,
	playbackMeasure: RhythmMeasure | null,
): RhythmMeasure | null {
	return playbackMeasure;
}

/** Count-in should run only when enabled for measure playback. */
export function shouldRunCountIn(
	activeSource: PlaybackSource | null,
	countInEnabled: boolean,
): boolean {
	return activeSource === 'measures' && countInEnabled;
}

/** Pass and measure-cycle change after the last subdivision of a bar. */
export function nextPassAfterBar(
	current: PlaybackPass,
	demoBeforePlay: boolean,
): { pass: PlaybackPass; bumpCycle: boolean } {
	if (!demoBeforePlay) {
		return { pass: current, bumpCycle: true };
	}
	if (current === 'demo') {
		return { pass: 'student', bumpCycle: false };
	}
	return { pass: 'demo', bumpCycle: true };
}
