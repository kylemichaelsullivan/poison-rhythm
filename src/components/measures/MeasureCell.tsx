import clsx from 'clsx';

type MeasureCellProps = {
	value: boolean;
	index: number;
};

export function MeasureCell({ value, index }: MeasureCellProps) {
	const isBeatBoundaryLeft = index % 4 === 0 && index > 0;
	const isBeatBoundaryRight = (index + 1) % 4 === 0 && index < 15;

	return (
		<div
			className={clsx(
				'MeasureCell aspect-square rounded-sm',
				value ? 'bg-primary' : 'bg-dark',
				isBeatBoundaryLeft && 'border-l-2 border-mid',
				isBeatBoundaryRight && 'border-r-2 border-mid',
			)}
			title={value ? 'Hit' : 'Rest'}
		/>
	);
}
