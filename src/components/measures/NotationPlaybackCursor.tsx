import { useSmoothNotationCursor } from '@/hooks/useSmoothNotationCursor';

type NotationPlaybackCursorProps = {
	playback?: boolean;
	hidden?: boolean;
	showVisualFeedback: boolean;
	isMeasuresPlaying: boolean;
};

export function NotationPlaybackCursor({
	playback = false,
	hidden = false,
	showVisualFeedback,
	isMeasuresPlaying,
}: NotationPlaybackCursorProps) {
	const showVisual = showVisualFeedback && !hidden;
	const show = playback && isMeasuresPlaying && showVisual;
	const leftPct = useSmoothNotationCursor(show);

	if (!show) {
		return null;
	}

	return (
		<div
			className='NotationPlaybackCursor pointer-events-none absolute inset-y-0 w-0.5 bg-primary'
			style={{ left: `${leftPct}%`, transform: 'translateX(-50%)' }}
			aria-hidden
		/>
	);
}
