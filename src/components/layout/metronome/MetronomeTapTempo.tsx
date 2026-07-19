import clsx from 'clsx';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type MetronomeTapTempoProps = {
	onTap: () => void;
};

export function MetronomeTapTempo({ onTap }: MetronomeTapTempoProps) {
	return (
		<div className='TapTempo flex justify-center'>
			<button
				type='button'
				className={clsx(
					'TapTempoButton flex items-center justify-center rounded-full border border-mid bg-primary w-24 h-24 font-medium text-white transition hover:border-white hover:opacity-90',
					focusVisibleRingClassName,
				)}
				title='Tap for Tempo'
				aria-label='Tap for Tempo'
				onClick={onTap}
			>
				Tap
			</button>
		</div>
	);
}
