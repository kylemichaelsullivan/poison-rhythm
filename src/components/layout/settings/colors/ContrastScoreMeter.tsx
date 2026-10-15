import clsx from 'clsx';
import { type ContrastRating, contrastGradePasses } from '@/lib/colors';
import { hierarchyBorderClass } from '@/lib/hierarchy-border';

type ContrastScoreMeterProps = {
	rating: ContrastRating;
};

/**
 * One contrast ratio: Dominant against Secondary.
 * Ink chrome borders so accent prefs cannot wash out the meter.
 */
export function ContrastScoreMeter({ rating }: ContrastScoreMeterProps) {
	const encourage = contrastGradePasses(rating.grade);
	const ratioLabel = `${rating.ratio.toFixed(1)}:1`;

	return (
		<output
			className={clsx(
				'ContrastScoreMeter flex items-center justify-between gap-4 rounded-md px-4 py-3',
				hierarchyBorderClass(encourage ? 'active' : 'provisional', 'ink'),
				'bg-chrome text-black',
			)}
			aria-live='polite'
			aria-label={`Grade ${rating.grade}, ${rating.ratio.toFixed(1)} to 1 between Dominant and Secondary`}
			data-testid='contrast-score-meter'
			data-contrast-grade={rating.grade}
			data-contrast={rating.level}
		>
			<p className='text-6xl font-black leading-none tracking-tight tabular-nums'>
				{rating.grade}
			</p>
			<p className='text-4xl font-bold leading-none tabular-nums'>
				{ratioLabel}
			</p>
		</output>
	);
}
