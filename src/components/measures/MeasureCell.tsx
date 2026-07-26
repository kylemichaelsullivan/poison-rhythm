import clsx from 'clsx';
import { useMetronome, useTheme } from '@/contexts';
import { cellToSubdivisionStep } from '@/lib';

type MeasureCellProps = {
	value: boolean;
	index: number;
	playback?: boolean;
};

export function MeasureCell({
	value,
	index,
	playback = false,
}: MeasureCellProps) {
	const { subdivisionLevel } = useTheme();
	const { isMeasuresPlaying, isLit, subdivisionIndex } = useMetronome();
	const isBeatBoundaryLeft = index % 4 === 0 && index > 0;
	const isBeatBoundaryRight = (index + 1) % 4 === 0 && index < 15;
	const isCurrentStep =
		playback &&
		isMeasuresPlaying &&
		cellToSubdivisionStep(subdivisionLevel, index) === subdivisionIndex;

	return (
		<div
			className={clsx(
				'MeasureCell aspect-square rounded-sm border border-mid',
				value ? 'bg-primary' : 'bg-surface-muted',
				isBeatBoundaryLeft && 'border-l-2 border-mid',
				isBeatBoundaryRight && 'border-r-2 border-mid',
				isCurrentStep &&
					'ring-2 ring-black shadow-secondary-glow',
				isCurrentStep && isLit && 'is-lit',
			)}
			title={value ? 'Hit' : 'Rest'}
		/>
	);
}
