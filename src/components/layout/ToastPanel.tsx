import clsx from 'clsx';
import { useState } from 'react';
import { TimedNoticeProgress } from '@/components/layout/TimedNoticeProgress';
import { Caption } from '@/components/ui';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';

type ToastPanelProps = {
	message: string;
	durationMs: number;
	onDismiss: () => void;
};

/** Subtle lower-right status card with a timed-notice progress bar. */
export function ToastPanel({
	message,
	durationMs,
	onDismiss,
}: ToastPanelProps) {
	const [paused, setPaused] = useState(false);
	useTimedDismiss(true, durationMs, onDismiss, paused);

	return (
		<output
			className={clsx(
				'ToastPanel relative block max-w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg px-3 py-2.5 shadow-raised',
				controlSurfaceBaseClassName,
			)}
			aria-live='polite'
			aria-atomic='true'
			data-testid='status-toast'
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<TimedNoticeProgress durationMs={durationMs} paused={paused} />
			<Caption size='sm'>{message}</Caption>
		</output>
	);
}
