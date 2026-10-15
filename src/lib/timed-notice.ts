/**
 * How long a timed notice stays open before it dismisses itself.
 * Change this constant to retune every notice that uses the default.
 */
export const TIMED_NOTICE_DURATION_MS = 2500;

/** Progress track height. Matches `.TimedNoticeProgress` in `src/index.css`. */
export const TIMED_NOTICE_PROGRESS_HEIGHT = '0.5rem';

/**
 * Fill amount from 0 to 1 as a notice approaches dismiss.
 * A non-positive duration is already expired.
 */
export function timedNoticeProgress(
	elapsedMs: number,
	durationMs: number,
): number {
	if (!Number.isFinite(elapsedMs) || !Number.isFinite(durationMs)) return 0;
	if (durationMs <= 0) return 1;
	if (elapsedMs <= 0) return 0;
	return Math.min(1, elapsedMs / durationMs);
}

export type TimedNoticeClock = {
	elapsedMs: number;
	/** `performance.now()` when the clock started running, or null while frozen. */
	runningSince: number | null;
};

export function createTimedNoticeClock(): TimedNoticeClock {
	return { elapsedMs: 0, runningSince: null };
}

/** Stop accumulating time. A second freeze is a no-op. */
export function freezeTimedNoticeClock(
	clock: TimedNoticeClock,
	now: number,
): TimedNoticeClock {
	if (clock.runningSince == null) return clock;
	const delta = Number.isFinite(now) ? now - clock.runningSince : 0;
	return {
		elapsedMs: clock.elapsedMs + Math.max(0, delta),
		runningSince: null,
	};
}

/** Start accumulating time. Already-running clocks stay as they are. */
export function runTimedNoticeClock(
	clock: TimedNoticeClock,
	now: number,
): TimedNoticeClock {
	if (clock.runningSince != null) return clock;
	return { elapsedMs: clock.elapsedMs, runningSince: now };
}

export function timedNoticeElapsedMs(
	clock: TimedNoticeClock,
	now: number,
): number {
	if (clock.runningSince == null) return Math.max(0, clock.elapsedMs);
	const delta = Number.isFinite(now) ? now - clock.runningSince : 0;
	return Math.max(0, clock.elapsedMs + Math.max(0, delta));
}

/** Milliseconds left before dismiss. Never negative. */
export function remainingTimedNoticeMs(
	elapsedMs: number,
	durationMs: number,
): number {
	if (!Number.isFinite(elapsedMs) || !Number.isFinite(durationMs)) {
		return 0;
	}
	if (durationMs <= 0) return 0;
	return Math.max(0, durationMs - Math.max(0, elapsedMs));
}
