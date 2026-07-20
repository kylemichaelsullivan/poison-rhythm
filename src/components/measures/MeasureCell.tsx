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
				'MeasureCell aspect-square rounded-sm',
				value ? 'bg-primary' : 'bg-dark',
				isBeatBoundaryLeft && 'border-l-2 border-mid',
				isBeatBoundaryRight && 'border-r-2 border-mid',
				isCurrentStep &&
					'ring-2 ring-white shadow-[0_0_0.5rem_var(--color-secondary)]',
				isCurrentStep && isLit && 'is-lit',
			)}
			title={value ? 'Hit' : 'Rest'}
		/>
	);
}
