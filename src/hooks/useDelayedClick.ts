import { useCallback, useEffect, useRef } from 'react';

const DEFAULT_DOUBLE_CLICK_MS = 280;

type UseDelayedClickOptions = {
	/** Delay before the single-click action runs (ms). */
	delayMs?: number;
	/** When set, a second click within `delayMs` runs this instead of `onClick`. */
	onDoubleClick?: () => void;
};

/**
 * Distinguishes a delayed single click from a double-click. When
 * `onDoubleClick` is omitted, `onClick` runs immediately.
 */
export function useDelayedClick(
	onClick: () => void,
	{
		delayMs = DEFAULT_DOUBLE_CLICK_MS,
		onDoubleClick,
	}: UseDelayedClickOptions = {},
): () => void {
	const clickTimerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (clickTimerRef.current !== undefined) {
				clearTimeout(clickTimerRef.current);
			}
		};
	}, []);

	return useCallback(() => {
		if (!onDoubleClick) {
			onClick();
			return;
		}

		if (clickTimerRef.current !== undefined) {
			clearTimeout(clickTimerRef.current);
			clickTimerRef.current = undefined;
			onDoubleClick();
			return;
		}

		clickTimerRef.current = window.setTimeout(() => {
			clickTimerRef.current = undefined;
			onClick();
		}, delayMs);
	}, [onClick, onDoubleClick, delayMs]);
}
