import { useMeasuresPlayPauseChrome } from '@/hooks/useMeasuresPlayPauseChrome';
import { RoundPlayPauseButton } from './RoundPlayPauseButton';
import type { Ref } from 'react';

type MeasuresPlayPauseButtonProps = {
	disabled?: boolean;
	onDisabledClick?: () => void;
	/** Defaults to metronome toggleMeasures. */
	onClick?: () => void;
	className?: string;
	ref?: Ref<HTMLButtonElement>;
};

/** Round Play/Pause wired to measures metronome chrome (lit ring, count-in, titles). */
export function MeasuresPlayPauseButton({
	disabled = false,
	onDisabledClick,
	onClick,
	className,
	ref,
}: MeasuresPlayPauseButtonProps) {
	const chrome = useMeasuresPlayPauseChrome({ disabled, className });

	return (
		<RoundPlayPauseButton
			className={chrome.className}
			isPlaying={chrome.isPlaying}
			label={chrome.label}
			title={chrome.title}
			countBeat={chrome.countBeat}
			disabled={disabled}
			onClick={onClick ?? chrome.toggleMeasures}
			onDisabledClick={onDisabledClick}
			ref={ref}
		/>
	);
}
