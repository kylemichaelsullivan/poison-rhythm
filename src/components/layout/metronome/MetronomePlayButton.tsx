import { RoundPlayPauseButton } from '@/components/controls/RoundPlayPauseButton';
import { useMetronome } from '@/contexts';

type MetronomePlayButtonProps = {
	disabled?: boolean;
};

/** Start/stop metronome — binds to global metronome clock. */
export function MetronomePlayButton({
	disabled = false,
}: MetronomePlayButtonProps) {
	const { isMetronomeRunning, toggleMetronome } = useMetronome();

	return (
		<div className='MetronomeControls flex shrink-0 items-center justify-center px-3 py-3'>
			<RoundPlayPauseButton
				isPlaying={isMetronomeRunning}
				label={isMetronomeRunning ? 'Stop Metronome' : 'Start Metronome'}
				disabled={disabled}
				onClick={toggleMetronome}
			/>
		</div>
	);
}
