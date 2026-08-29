import clsx from 'clsx';
import { useMetronome, usePreferences, useSettings } from '@/contexts';
import { cellToSubdivisionStep } from '@/lib';
import { shouldShowVisualFeedback } from '@/lib/audio';
import { shouldHighlightPlaybackStep } from '@/lib/playback-state';
import { shouldShowAccents, shouldShowSticking } from '@/lib/settings-schema';
import { RhythmAccentMark } from './RhythmAccentMark';
import { RhythmStickingLabel } from './RhythmStickingLabel';

type MeasureCellProps = {
	value: boolean;
	index: number;
	playback?: boolean;
	accent?: boolean;
	sticking?: 'L' | 'R';
	hidden?: boolean;
};

export function MeasureCell({
	value,
	index,
	playback = false,
	accent = false,
	sticking,
	hidden = false,
}: MeasureCellProps) {
	const { subdivisionLevel } = usePreferences();
	const { settings } = useSettings();
	const { isMeasuresPlaying, subdivisionIndex } = useMetronome();
	const isBeatBoundaryLeft = index % 4 === 0 && index > 0;
	const isBeatBoundaryRight = (index + 1) % 4 === 0 && index < 15;
	const showVisual = shouldShowVisualFeedback(settings.feedbackMode) && !hidden;
	const isCurrentStep = shouldHighlightPlaybackStep({
		playbackEnabled: playback,
		isMeasuresPlaying,
		cellStep: cellToSubdivisionStep(subdivisionLevel, index),
		subdivisionIndex,
		showVisual: true,
	});
	const showStepHighlight = isCurrentStep && showVisual;
	const showAccent = shouldShowAccents(settings) && accent && value;
	const showSticking = shouldShowSticking(settings) && sticking && value;

	return (
		<div
			className={clsx(
				'MeasureCell relative aspect-square rounded-sm border border-mid',
				value ? 'bg-primary' : 'bg-surface-muted',
				isBeatBoundaryLeft && 'border-l-2 border-mid',
				isBeatBoundaryRight && 'border-r-2 border-mid',
				showStepHighlight &&
					'ring-2 ring-black transition-[box-shadow] duration-200',
				hidden && value && 'opacity-0',
			)}
			title={value ? (accent ? 'Accent Hit' : 'Hit') : 'Rest'}
			data-cell-index={index}
			data-highlighted={showStepHighlight ? 'true' : undefined}
		>
			{showAccent ? <RhythmAccentMark /> : null}
			{showSticking ? (
				<span className='absolute inset-x-0 top-full mt-0.5 text-center'>
					<RhythmStickingLabel hand={sticking} />
				</span>
			) : null}
		</div>
	);
}
