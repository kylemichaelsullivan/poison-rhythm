import clsx from 'clsx';
import { useState } from 'react';
import { TimedNoticeProgress } from '@/components/layout/TimedNoticeProgress';
import { Caption } from '@/components/ui';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { hierarchyBorderClass } from '@/lib/hierarchy-border';

type ToastPanelProps = {
	message: string;
	durationMs: number;
	onDismiss: () => void;
};

/** Lower-right status card with a timed-notice progress bar. */
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
				'ToastPanel relative block max-w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg bg-chrome px-3 py-2.5 text-black shadow-raised',
				hierarchyBorderClass('emphasis', 'mid'),
			)}
			aria-live='polite'
			aria-atomic='true'
			data-testid='status-toast'
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<TimedNoticeProgress durationMs={durationMs} paused={paused} />
			<Caption size='base'>{message}</Caption>
		</output>
	);
}
