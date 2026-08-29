import { AUDIO_SCHEDULE_LEAD_SEC, COUNT_IN_BEATS } from './metronome-defaults';
import type { SubdivisionLevel } from './preference-schemas';
import {
	isQuarterDownbeat,
	subdivisionPulseSec,
	subdivisionStepCount,
} from './subdivision-playback';

export type PlaybackPhase = 'count-in' | 'playback';

export type PlaybackClockEvent = {
	audioTime: number;
	phase: PlaybackPhase;
	/** Count-in beat index, or subdivision step within the current bar. */
	index: number;
	isDownbeat: boolean;
	isLastStepInBar: boolean;
};

export type PlaybackClock = {
	peek: () => PlaybackClockEvent;
	advance: () => PlaybackClockEvent;
	readonly stepSec: number;
	readonly quarterSec: number;
	readonly firstPlaybackAt: number;
	readonly countInBeatTimes: number[];
};

export function quarterNoteSec(tempo: number): number {
	return 60 / tempo;
}

export type PlaybackClockOptions = {
	tempo: number;
	subdivisionLevel: SubdivisionLevel;
	countInEnabled: boolean;
	audioNow: number;
	leadSec?: number;
	beatCount?: number;
};

/**
 * Continuous audio-clock timeline: optional quarter-note count-in, then
 * subdivision steps. The first playback step is exactly one quarter after the
 * last count-in click — no extra lead or timer gap.
 */
export function createPlaybackClock(
	options: PlaybackClockOptions,
): PlaybackClock {
	const quarterSec = quarterNoteSec(options.tempo);
	const stepSec = subdivisionPulseSec(options.tempo, options.subdivisionLevel);
	const leadSec = options.leadSec ?? AUDIO_SCHEDULE_LEAD_SEC;
	const beatCount = options.beatCount ?? COUNT_IN_BEATS;
	const startAt = options.audioNow + leadSec;
	const countInBeatTimes = options.countInEnabled
		? Array.from({ length: beatCount }, (_, i) => startAt + i * quarterSec)
		: [];
	const firstPlaybackAt = options.countInEnabled
		? startAt + beatCount * quarterSec
		: startAt;
	const stepCount = subdivisionStepCount(options.subdivisionLevel);

	let phase: PlaybackPhase = options.countInEnabled ? 'count-in' : 'playback';
	let countInIndex = 0;
	let stepIndex = 0;
	let nextTime = startAt;

	const buildEvent = (): PlaybackClockEvent => {
		if (phase === 'count-in') {
			return {
				audioTime: nextTime,
				phase: 'count-in',
				index: countInIndex,
				isDownbeat: true,
				isLastStepInBar: countInIndex === beatCount - 1,
			};
		}

		return {
			audioTime: nextTime,
			phase: 'playback',
			index: stepIndex,
			isDownbeat: isQuarterDownbeat(options.subdivisionLevel, stepIndex),
			isLastStepInBar: stepIndex === stepCount - 1,
		};
	};

	return {
		get stepSec() {
			return stepSec;
		},
		get quarterSec() {
			return quarterSec;
		},
		get firstPlaybackAt() {
			return firstPlaybackAt;
		},
		get countInBeatTimes() {
			return countInBeatTimes;
		},
		peek: buildEvent,
		advance: () => {
			const event = buildEvent();
			if (phase === 'count-in') {
				countInIndex += 1;
				if (countInIndex >= beatCount) {
					phase = 'playback';
					nextTime = firstPlaybackAt;
				} else {
					nextTime += quarterSec;
				}
			} else {
				stepIndex = (stepIndex + 1) % stepCount;
				nextTime += stepSec;
			}
			return event;
		},
	};
}

/** Pause look-ahead after a bar only when the carousel measure will advance. */
export function shouldHoldLookaheadAfterEvent(
	event: PlaybackClockEvent,
	bumpMeasureCycle: boolean,
): boolean {
	return (
		event.phase === 'playback' && event.isLastStepInBar && bumpMeasureCycle
	);
}
