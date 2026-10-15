import { useEffect, useRef } from 'react';
import {
	createTimedNoticeClock,
	freezeTimedNoticeClock,
	remainingTimedNoticeMs,
	runTimedNoticeClock,
	timedNoticeElapsedMs,
} from '@/lib/timed-notice';

/**
 * Calls `onDismiss` after `durationMs` while `active` is true.
 * `paused` freezes the clock (pointer over the dialog). Time also freezes
 * while the document is hidden, because iOS can defer timers in the background.
 */
export function useTimedDismiss(
	active: boolean,
	durationMs: number | undefined,
	onDismiss: () => void,
	paused = false,
): void {
	const clockRef = useRef(createTimedNoticeClock());

	useEffect(() => {
		if (!active || durationMs == null) {
			clockRef.current = createTimedNoticeClock();
			return;
		}

		const duration = durationMs;
		let timeoutId = 0;

		const stop = () => {
			window.clearTimeout(timeoutId);
			clockRef.current = freezeTimedNoticeClock(
				clockRef.current,
				performance.now(),
			);
		};

		const start = () => {
			window.clearTimeout(timeoutId);
			const hidden = document.visibilityState === 'hidden';
			if (paused || hidden) {
				clockRef.current = freezeTimedNoticeClock(
					clockRef.current,
					performance.now(),
				);
				return;
			}
			clockRef.current = runTimedNoticeClock(
				clockRef.current,
				performance.now(),
			);
			const remaining = remainingTimedNoticeMs(
				timedNoticeElapsedMs(clockRef.current, performance.now()),
				duration,
			);
			timeoutId = window.setTimeout(onDismiss, remaining);
		};

		start();

		const onVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				stop();
				return;
			}
			start();
		};

		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [active, durationMs, onDismiss, paused]);
}
