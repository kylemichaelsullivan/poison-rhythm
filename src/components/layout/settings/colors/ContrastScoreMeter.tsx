import clsx from 'clsx';
import type { ContrastRating } from '@/lib/colors';
import { hierarchyBorderClass } from '@/lib/hierarchy-border';

type ContrastScoreMeterProps = {
	rating: ContrastRating;
};

const WCAG_LABEL: Record<ContrastRating['grade'], string> = {
	A: 'AAA',
	B: 'AA',
	C: 'UI',
	F: 'Fail',
};

/**
 * Pair contrast readout: one WCAG 2.2 ratio + letter grade.
 * Ink chrome borders so accent prefs cannot wash out the meter.
 */
export function ContrastScoreMeter({ rating }: ContrastScoreMeterProps) {
	const encourage = rating.grade === 'A' || rating.grade === 'B';

	return (
		<output
			className={clsx(
				'ContrastScoreMeter flex items-center justify-between gap-3 rounded-md px-3 py-2.5',
				hierarchyBorderClass(encourage ? 'active' : 'provisional', 'ink'),
				'bg-chrome text-black',
			)}
			aria-live='polite'
			data-testid='contrast-score-meter'
			data-contrast-grade={rating.grade}
			data-contrast={rating.level}
		>
			<p className='text-sm font-semibold tabular-nums'>
				<span className='text-2xl font-bold leading-none'>{rating.grade}</span>
				<span className='ml-2 text-mid'>·</span>
				<span className='ml-2'>{rating.ratio.toFixed(1)}:1</span>
			</p>
			<p className='text-xs font-medium text-dark'>
				{WCAG_LABEL[rating.grade]}
			</p>
		</output>
	);
}
