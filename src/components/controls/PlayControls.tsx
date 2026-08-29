import clsx from 'clsx';
import { type Ref, useEffect } from 'react';
import { useMetronome } from '@/contexts';
import { RoundPlayPauseButton } from './RoundPlayPauseButton';

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
		isLit,
		toggleMeasures,
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
			data-counting-in={isCountingIn ? 'true' : 'false'}
			data-measures-playing={isMeasuresPlaying ? 'true' : 'false'}
		>
			<RoundPlayPauseButton
				className={clsx(
					'PlayControlsButton transition-[opacity,box-shadow] duration-100',
					isCountingIn && !isLit && 'opacity-55',
					isCountingIn && isLit && 'opacity-100 ring-2 ring-black',
					!isCountingIn && isMeasuresRunning && isLit && 'ring-2 ring-black',
				)}
				isPlaying={isMeasuresRunning}
				title={disabled ? 'Click + Start' : undefined}
				disabled={disabled}
				onClick={toggleMeasures}
				onDisabledClick={onDisabledClick}
				ref={playButtonRef}
			/>
		</div>
	);
}
