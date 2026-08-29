import {
	LOOKAHEAD_INTERVAL_MS,
	SCHEDULE_AHEAD_SEC,
} from './metronome-defaults';

export type LookaheadDueResult = 'pause' | undefined;

export type DrainDueEventsOptions = {
	peekNextTime: () => number;
	onDue: () => LookaheadDueResult;
	audioNow: number;
	scheduleAheadSec: number;
	maxEvents?: number;
};

/**
 * Schedule every clock event whose audio time falls within the look-ahead
 * horizon. Returns how many events were dispatched.
 */
export function drainDueEvents(options: DrainDueEventsOptions): number {
	const maxEvents = options.maxEvents ?? 64;
	let count = 0;
	while (
		options.peekNextTime() < options.audioNow + options.scheduleAheadSec &&
		count < maxEvents
	) {
		const result = options.onDue();
		count += 1;
		if (result === 'pause') break;
	}
	return count;
}

type TimerHandle = number;

export type LookaheadSchedulerOptions = {
	getAudioTime: () => number;
	peekNextTime: () => number;
	onDue: () => LookaheadDueResult;
	scheduleAheadSec?: number;
	intervalMs?: number;
	setIntervalFn?: (handler: () => void, ms: number) => TimerHandle;
	clearIntervalFn?: (id: TimerHandle) => void;
};

export type LookaheadScheduler = {
	start: () => void;
	stop: () => void;
	nudge: () => void;
};

/**
 * Poll the audio clock and schedule events slightly in the future so count-in
 * and playback share one timeline (no wall-clock setTimeout join).
 */
export function createLookaheadScheduler(
	options: LookaheadSchedulerOptions,
): LookaheadScheduler {
	const scheduleAheadSec = options.scheduleAheadSec ?? SCHEDULE_AHEAD_SEC;
	const intervalMs = options.intervalMs ?? LOOKAHEAD_INTERVAL_MS;
	const setIntervalFn =
		options.setIntervalFn ??
		((handler, ms) =>
			globalThis.setInterval(handler, ms) as unknown as TimerHandle);
	const clearIntervalFn =
		options.clearIntervalFn ??
		((id) => {
			globalThis.clearInterval(id as unknown as ReturnType<typeof setInterval>);
		});

	let intervalId: TimerHandle | null = null;

	const tick = () => {
		drainDueEvents({
			peekNextTime: options.peekNextTime,
			onDue: options.onDue,
			audioNow: options.getAudioTime(),
			scheduleAheadSec,
		});
	};

	return {
		start: () => {
			if (intervalId !== null) return;
			tick();
			intervalId = setIntervalFn(tick, intervalMs);
		},
		stop: () => {
			if (intervalId === null) return;
			clearIntervalFn(intervalId);
			intervalId = null;
		},
		nudge: tick,
	};
}
