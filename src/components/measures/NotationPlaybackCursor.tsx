import { useMetronome, useSettings } from '@/contexts';
import { useSmoothNotationCursor } from '@/hooks/useSmoothNotationCursor';
import { shouldShowVisualFeedback } from '@/lib/audio';

type NotationPlaybackCursorProps = {
	playback?: boolean;
	hidden?: boolean;
};

export function NotationPlaybackCursor({
	playback = false,
	hidden = false,
}: NotationPlaybackCursorProps) {
	const { settings } = useSettings();
	const { isMeasuresPlaying } = useMetronome();
	const showVisual = shouldShowVisualFeedback(settings.feedbackMode) && !hidden;
	const show = playback && isMeasuresPlaying && showVisual;
	const leftPct = useSmoothNotationCursor(show);

	if (!show) {
		return null;
	}

	return (
		<div
			className='NotationPlaybackCursor pointer-events-none absolute inset-y-0 w-0.5 bg-black/70'
			style={{ left: `${leftPct}%`, transform: 'translateX(-50%)' }}
			aria-hidden
		/>
	);
}
