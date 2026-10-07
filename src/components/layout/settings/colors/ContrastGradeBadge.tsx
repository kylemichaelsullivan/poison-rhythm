import clsx from 'clsx';
import { type ContrastGrade, contrastGradePasses } from '@/lib/colors';

type ContrastGradeBadgeProps = {
	grade: ContrastGrade;
};

/** Compact WCAG label chip — ink chrome so crayon fill cannot wash it out. */
export function ContrastGradeBadge({ grade }: ContrastGradeBadgeProps) {
	const encourage = contrastGradePasses(grade);
	const compact = grade === 'AAA' || grade === 'Fail';
	return (
		<span
			className={clsx(
				'ContrastGradeBadge pointer-events-none absolute top-0.5 right-0.5 z-10 flex h-4 items-center justify-center rounded-[2px] font-bold leading-none',
				compact
					? 'min-w-[1.15rem] px-0.5 text-[0.4rem]'
					: 'min-w-4 px-0.5 text-[0.5rem]',
				encourage
					? 'bg-black text-white'
					: grade === 'UI'
						? 'bg-chrome text-black border border-black'
						: 'bg-chrome text-mid border border-dashed border-black',
			)}
			aria-hidden='true'
		>
			{grade}
		</span>
	);
}
