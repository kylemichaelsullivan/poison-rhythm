import clsx from 'clsx';
import { useMetronome } from '@/contexts';
import {
	GENERATE_ROUND_TITLE,
	measuresPlayPauseLabel,
	measuresPlayPauseTitle,
} from '@/lib/ui-copy';

type UseMeasuresPlayPauseChromeOptions = {
	/** When true, title becomes the generate-round prompt. */
	disabled?: boolean;
	className?: string;
};

/**
 * Shared Play/Pause chrome from metronome state for footer and carousel end menu.
 */
export function useMeasuresPlayPauseChrome({
	disabled = false,
	className,
}: UseMeasuresPlayPauseChromeOptions = {}) {
	const {
		isMeasuresRunning,
		isCountingIn,
		countInBeat,
		isLit,
		toggleMeasures,
	} = useMetronome();

	const lit =
		(isCountingIn || isMeasuresRunning) && isLit ? 'ring-2 ring-primary' : null;

	return {
		isPlaying: isMeasuresRunning && !isCountingIn,
		label: measuresPlayPauseLabel(isMeasuresRunning),
		title: disabled
			? GENERATE_ROUND_TITLE
			: measuresPlayPauseTitle(isMeasuresRunning),
		countBeat: isCountingIn ? countInBeat : null,
		className: clsx('transition-[box-shadow] duration-100', lit, className),
		toggleMeasures,
		isMeasuresRunning,
		isCountingIn,
		countInBeat,
		isLit,
	};
}
