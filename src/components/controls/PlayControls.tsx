import clsx from 'clsx';
import { useEffect } from 'react';
import { useMetronome } from '@/contexts';
import { RoundPlayPauseButton } from './RoundPlayPauseButton';

type PlayControlsProps = {
	disabled?: boolean;
	/** Called when the button is clicked while disabled. */
	onDisabledClick?: () => void;
};

export function PlayControls({
	disabled = false,
	onDisabledClick,
}: PlayControlsProps) {
	const { isMeasuresRunning, isLit, toggleMeasures, stop } = useMetronome();

	useEffect(() => {
		if (disabled && isMeasuresRunning) {
			stop();
		}
	}, [disabled, isMeasuresRunning, stop]);

	return (
		<div className='PlayControls flex justify-center w-full'>
			<RoundPlayPauseButton
				className={clsx(
					'PlayControlsButton',
					'Blinker',
					isMeasuresRunning && isLit && 'is-lit',
				)}
				isPlaying={isMeasuresRunning}
				title={disabled ? 'Click the New button first' : undefined}
				disabled={disabled}
				onClick={toggleMeasures}
				onDisabledClick={onDisabledClick}
			/>
		</div>
	);
}
