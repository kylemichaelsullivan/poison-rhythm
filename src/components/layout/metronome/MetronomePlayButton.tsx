import clsx from 'clsx';
import { RoundPlayPauseButton } from '@/components/controls/RoundPlayPauseButton';
import { useMetronome } from '@/contexts';

type MetronomePlayButtonProps = {
	isRunning: boolean;
	disabled?: boolean;
	onToggle: () => void;
};

export function MetronomePlayButton({
	isRunning,
	disabled = false,
	onToggle,
}: MetronomePlayButtonProps) {
	const { isLit, isMetronomeRunning } = useMetronome();

	return (
		<div className='MetronomeControls flex shrink-0 items-center justify-center px-3 py-3'>
			<RoundPlayPauseButton
				className={clsx('Blinker', isMetronomeRunning && isLit && 'is-lit')}
				isPlaying={isRunning}
				label={isRunning ? 'Stop Metronome' : 'Start Metronome'}
				disabled={disabled}
				onClick={onToggle}
			/>
		</div>
	);
}
