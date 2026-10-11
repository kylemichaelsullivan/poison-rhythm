import clsx from 'clsx';
import {
	type ContrastGrade,
	type ContrastRating,
	contrastGradePasses,
} from '@/lib/colors';
import { hierarchyBorderClass } from '@/lib/hierarchy-border';

type ContrastScoreMeterProps = {
	rating: ContrastRating;
};

const ENCOURAGEMENT: Record<ContrastGrade, string> = {
	A: 'Save or die',
	B: 'Con save failed',
	C: 'Half damage',
	F: 'Immune',
};

/**
 * Pair contrast readout — poison / D&D stakes, large letter grade.
 * Ink chrome borders so accent prefs cannot wash out the meter.
 */
export function ContrastScoreMeter({ rating }: ContrastScoreMeterProps) {
	const encourage = contrastGradePasses(rating.grade);
	const hint = ENCOURAGEMENT[rating.grade];

	return (
		<output
			className={clsx(
				'ContrastScoreMeter flex items-center justify-between gap-3 rounded-md px-3 py-3',
				hierarchyBorderClass(encourage ? 'active' : 'provisional', 'ink'),
				'bg-chrome text-black',
			)}
			aria-live='polite'
			aria-label={`Grade ${rating.grade}, ${rating.ratio.toFixed(1)} to 1. ${hint}`}
			data-testid='contrast-score-meter'
			data-contrast-grade={rating.grade}
			data-contrast={rating.level}
		>
			<p className='flex items-baseline gap-2.5 font-semibold tabular-nums'>
				<span className='text-6xl font-black leading-none tracking-tight'>
					{rating.grade}
				</span>
				<span className='text-lg text-mid'>·</span>
				<span className='text-lg'>{rating.ratio.toFixed(1)}:1</span>
			</p>
			<p className='max-w-[9rem] text-right text-sm font-semibold text-dark'>
				{hint}
			</p>
		</output>
	);
}
