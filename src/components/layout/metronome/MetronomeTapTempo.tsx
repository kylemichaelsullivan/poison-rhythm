import clsx from 'clsx';
import { primaryFillChromeClassName } from '@/lib/control-classes';

type MetronomeTapTempoProps = {
	onTap: () => void;
};

export function MetronomeTapTempo({ onTap }: MetronomeTapTempoProps) {
	return (
		<div className='TapTempo flex justify-center'>
			<button
				type='button'
				className={clsx(
					'TapTempoButton',
					primaryFillChromeClassName,
					'flex size-24 shrink-0 aspect-square items-center justify-center rounded-full border border-primary-border bg-primary font-medium text-on-primary',
				)}
				title='Tap for Tempo'
				aria-label='Tap for Tempo'
				data-chrome-active='true'
				onClick={onTap}
			>
				Tap
			</button>
		</div>
	);
}
