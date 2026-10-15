import type { CSSProperties } from 'react';

type TimedNoticeProgressProps = {
	durationMs: number;
	paused?: boolean;
};

/**
 * Left-to-right fill for a timed notice. Color and motion live in
 * `.TimedNoticeProgress` (`src/index.css`) so iOS gets a solid color and a
 * prefixed gradient even when `color-mix()` / `oklch()` are unavailable.
 */
export function TimedNoticeProgress({
	durationMs,
	paused = false,
}: TimedNoticeProgressProps) {
	return (
		<div
			className='TimedNoticeProgress pointer-events-none absolute inset-x-0 top-0'
			style={
				{
					'--timed-notice-duration': `${durationMs}ms`,
				} as CSSProperties
			}
			role='progressbar'
			aria-label='Closing automatically'
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext={paused ? 'Paused' : 'Closes automatically'}
			data-testid='timed-notice-progress'
			data-duration-ms={durationMs}
			data-paused={paused ? 'true' : 'false'}
		/>
	);
}
