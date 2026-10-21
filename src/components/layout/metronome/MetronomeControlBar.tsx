import clsx from 'clsx';
import {
	controlSurfaceBaseClassName,
	sideGutterCollapsedReserveClassName,
} from '@/lib/control-classes';
import { MetronomeModifyTempoButton } from './MetronomeModifyTempoButton';
import { MetronomePlayButton } from './MetronomePlayButton';
import { MetronomeTempoSlider } from './MetronomeTempoSlider';

type MetronomeControlBarProps = {
	disabled?: boolean;
};

/**
 * Tempo ± sit in-flow beside the control surface (inside the modal) when
 * there is room. Below ~63rem they drop under the surface; pair with
 * `sideGutterCollapsedReserveClassName` so they clear the bar and Tap.
 * Play / tempo bind globally inside child composers.
 */
export function MetronomeControlBar({
	disabled = false,
}: MetronomeControlBarProps) {
	return (
		<div
			id='beat-selector'
			tabIndex={-1}
			className={clsx(
				'MetronomeContent relative flex w-full items-center gap-[var(--side-gutter-width)]',
				sideGutterCollapsedReserveClassName,
			)}
		>
			<MetronomeModifyTempoButton direction='decrease' />
			<div
				className={clsx(
					'MetronomeControlSurface flex min-w-0 flex-1 flex-col justify-center gap-4 items-center px-3 py-4 sm:flex-row sm:px-6',
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
