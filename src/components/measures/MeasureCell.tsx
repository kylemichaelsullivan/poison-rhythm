import clsx from 'clsx';
import { cellToSubdivisionStep } from '@/lib';
import { shouldHighlightPlaybackStep } from '@/lib/playback-state';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import {
	type MeasurePlaybackPhase,
	measureHitClass,
	measureHitHighlightClass,
} from './measure-phase-chrome';
import { RhythmAccentMark } from './RhythmAccentMark';
import { RhythmStickingLabel } from './RhythmStickingLabel';

type MeasureCellProps = {
	value: boolean;
	index: number;
	playback?: boolean;
	accent?: boolean;
	sticking?: 'L' | 'R';
	hidden?: boolean;
	phase?: MeasurePlaybackPhase;
	subdivisionLevel: SubdivisionLevel;
	showVisualFeedback: boolean;
	showAccents: boolean;
	showSticking: boolean;
	isMeasuresPlaying: boolean;
	subdivisionIndex: number;
};

export function MeasureCell({
	value,
	index,
	playback = false,
	accent = false,
	sticking,
	hidden = false,
	phase,
	subdivisionLevel,
	showVisualFeedback,
	showAccents,
	showSticking,
	isMeasuresPlaying,
	subdivisionIndex,
}: MeasureCellProps) {
	const showVisual = showVisualFeedback && !hidden;
	const isCurrentStep = shouldHighlightPlaybackStep({
		playbackEnabled: playback,
		isMeasuresPlaying,
		cellStep: cellToSubdivisionStep(subdivisionLevel, index),
		subdivisionIndex,
		showVisual: true,
	});
	const showStepHighlight = isCurrentStep && showVisual;
	const showAccentMark = showAccents && accent && value;
	const showStickingLabel = showSticking && sticking && value;

	return (
		<div
			className={clsx(
				'MeasureCell relative aspect-square rounded-[3px]',
				value ? measureHitClass(phase) : 'bg-surface-muted',
				showStepHighlight && measureHitHighlightClass(phase),
				hidden && value && 'opacity-0',
			)}
			title={value ? (accent ? 'Accent Hit' : 'Hit') : 'Rest'}
			data-cell-index={index}
			data-highlighted={showStepHighlight ? 'true' : undefined}
		>
			{showAccentMark ? <RhythmAccentMark /> : null}
			{showStickingLabel ? (
				<span className='absolute inset-x-0 top-full mt-0.5 text-center'>
					<RhythmStickingLabel hand={sticking} />
				</span>
			) : null}
		</div>
	);
}
