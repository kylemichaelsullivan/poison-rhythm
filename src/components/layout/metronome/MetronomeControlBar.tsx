import clsx from 'clsx';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
import { MetronomeModifyTempoButton } from './MetronomeModifyTempoButton';
import { MetronomePlayButton } from './MetronomePlayButton';
import { MetronomeTempoSlider } from './MetronomeTempoSlider';

type MetronomeControlBarProps = {
	disabled?: boolean;
};

/**
 * Tempo ± stay in-flow beside Play + slider so the first open reads as one
 * control (the modal never reaches the page gutter breakpoint).
 * Play / tempo bind globally inside child composers.
 */
export function MetronomeControlBar({
	disabled = false,
}: MetronomeControlBarProps) {
	return (
		<div
			id='beat-selector'
			tabIndex={-1}
			className='MetronomeContent relative flex w-full items-center gap-2'
		>
			<MetronomeModifyTempoButton direction='decrease' />
			<div
				className={clsx(
					'MetronomeControlSurface flex min-w-0 flex-1 flex-row items-center justify-center gap-2 px-2 py-3 sm:gap-4 sm:px-6',
					controlSurfaceBaseClassName,
				)}
			>
				<MetronomePlayButton disabled={disabled} />
				<MetronomeTempoSlider />
			</div>
			<MetronomeModifyTempoButton direction='increase' />
		</div>
	);
}
