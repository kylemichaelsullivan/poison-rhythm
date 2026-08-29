import { RoundPlayPauseButton } from '@/components/controls/RoundPlayPauseButton';

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
	return (
		<div className='MetronomeControls flex shrink-0 items-center justify-center px-3 py-3'>
			<RoundPlayPauseButton
				isPlaying={isRunning}
				label={isRunning ? 'Stop Metronome' : 'Start Metronome'}
				disabled={disabled}
				onClick={onToggle}
			/>
		</div>
	);
}
