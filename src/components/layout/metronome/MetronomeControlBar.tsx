import clsx from 'clsx';
import {
	controlSurfaceBaseClassName,
	sideGutterCollapsedReserveClassName,
} from '@/lib/control-classes';
import { MetronomeModifyTempoButton } from './MetronomeModifyTempoButton';
import { MetronomePlayButton } from './MetronomePlayButton';
import { MetronomeTempoSlider } from './MetronomeTempoSlider';

type MetronomeControlBarProps = {
	tempo: number;
	isRunning: boolean;
	disabled?: boolean;
	onToggle: () => void;
	onTempoChange: (value: number) => void;
};

/**
 * Tempo ± sit in the gutters beside the control surface.
 * Below ~63rem (no lateral gutter), they drop under the surface with
 * `sideGutterCollapsedReserveClassName` so they clear the bar and Tap.
 */
export function MetronomeControlBar({
	tempo,
	isRunning,
	disabled = false,
	onToggle,
	onTempoChange,
}: MetronomeControlBarProps) {
	return (
		<div
			id='beat-selector'
			tabIndex={-1}
			className={clsx(
				'MetronomeContent relative w-full',
				sideGutterCollapsedReserveClassName,
			)}
		>
			<MetronomeModifyTempoButton
				direction='decrease'
				tempo={tempo}
				onTempoChange={onTempoChange}
			/>
			<div
				className={clsx(
					'MetronomeControlSurface flex flex-col justify-center gap-4 items-center px-3 py-4 sm:flex-row sm:px-8',
					controlSurfaceBaseClassName,
				)}
			>
				<MetronomePlayButton
					isRunning={isRunning}
					disabled={disabled}
					onToggle={onToggle}
				/>
				<MetronomeTempoSlider tempo={tempo} onTempoChange={onTempoChange} />
			</div>
			<MetronomeModifyTempoButton
				direction='increase'
				tempo={tempo}
				onTempoChange={onTempoChange}
			/>
		</div>
	);
}
