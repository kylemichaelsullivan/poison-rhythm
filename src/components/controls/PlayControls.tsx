import { useEffect } from 'react';
import { useMetronome } from '@/contexts';
import { dataBool } from '@/lib/data-attr';
import { MeasuresPlayPauseButton } from './MeasuresPlayPauseButton';
import type { Ref } from 'react';

type PlayControlsProps = {
	disabled?: boolean;
	/** Called when the button is clicked while disabled. */
	onDisabledClick?: () => void;
	playButtonRef?: Ref<HTMLButtonElement>;
};

export function PlayControls({
	disabled = false,
	onDisabledClick,
	playButtonRef,
}: PlayControlsProps) {
	const {
		isMeasuresRunning,
		isMeasuresPlaying,
		isCountingIn,
		countInBeat,
		stop,
	} = useMetronome();

	useEffect(() => {
		if (disabled && isMeasuresRunning) {
			stop();
		}
	}, [disabled, isMeasuresRunning, stop]);

	return (
		<div
			className='PlayControls flex justify-center w-full'
			data-testid='play-controls'
			data-counting-in={dataBool(isCountingIn)}
			data-count-in-beat={countInBeat != null ? String(countInBeat) : ''}
			data-measures-playing={dataBool(isMeasuresPlaying)}
		>
			<MeasuresPlayPauseButton
				className='PlayControlsButton'
				disabled={disabled}
				onDisabledClick={onDisabledClick}
				ref={playButtonRef}
			/>
		</div>
	);
}
