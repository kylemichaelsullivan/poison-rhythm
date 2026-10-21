import clsx from 'clsx';
import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';

type SelectionCheckMarkProps = {
	/** Compact corner mark on crayon swatches; larger on tiles / pairings. */
	size?: 'sm' | 'md';
	/** Softer mark for the non-editing role’s current color. */
	muted?: boolean;
	/** Corner overlays swatches/tiles; inline sits in a row (pairings). */
	position?: 'corner' | 'inline';
};

/**
 * Non-color selection cue (shape + ink chip). Uses theme `black`/`white` so it
 * stays readable in Light, Dark, and System.
 */
export function SelectionCheckMark({
	size = 'sm',
	muted = false,
	position = 'corner',
}: SelectionCheckMarkProps) {
	return (
		<span
			className={clsx(
				'SelectionCheckMark pointer-events-none z-20 flex shrink-0 items-center justify-center rounded-full bg-black text-white',
				position === 'corner' && 'absolute',
				size === 'sm' ? 'size-3.5' : 'size-5',
				position === 'corner' &&
					(size === 'sm' ? 'bottom-0.5 left-0.5' : 'bottom-1.5 left-1.5'),
				muted && 'opacity-80',
			)}
			aria-hidden='true'
		>
			<CheckmarkIcon
				className={clsx('fill-current', size === 'sm' ? 'size-2' : 'size-2.5')}
			/>
		</span>
	);
}
