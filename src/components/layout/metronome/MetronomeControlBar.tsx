import clsx from 'clsx';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
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
				'MetronomeContent relative flex flex-col justify-center gap-4 items-center px-8 py-4 text-white sm:flex-row',
				controlSurfaceBaseClassName,
			)}
		>
			<MetronomeModifyTempoButton
				direction='decrease'
				tempo={tempo}
				onTempoChange={onTempoChange}
			/>
			<MetronomePlayButton
				isRunning={isRunning}
				disabled={disabled}
				onToggle={onToggle}
			/>
			<MetronomeTempoSlider tempo={tempo} onTempoChange={onTempoChange} />
			<MetronomeModifyTempoButton
				direction='increase'
				tempo={tempo}
				onTempoChange={onTempoChange}
			/>
		</div>
	);
}
