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
					'TapTempoButton flex size-24 shrink-0 aspect-square items-center justify-center rounded-full border-2 border-primary-border bg-primary font-medium text-on-primary transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-raised focus-visible:shadow-raised',
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
