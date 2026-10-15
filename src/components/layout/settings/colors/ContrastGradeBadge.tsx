import clsx from 'clsx';
import { type ContrastGrade, contrastGradePasses } from '@/lib/colors';

type ContrastGradeBadgeProps = {
	grade: ContrastGrade;
};

/** Letter-grade chip — ink chrome so crayon fill cannot wash it out. */
export function ContrastGradeBadge({ grade }: ContrastGradeBadgeProps) {
	const encourage = contrastGradePasses(grade);
	return (
		<span
			className={clsx(
				'ContrastGradeBadge pointer-events-none absolute top-0.5 right-0.5 z-10 flex size-6 items-center justify-center rounded-sm text-sm font-black leading-none',
				encourage
					? 'bg-black text-white'
					: grade === 'C'
						? 'bg-chrome text-black border border-black'
						: grade === 'D'
							? 'bg-chrome text-black border border-dashed border-black'
							: 'bg-chrome text-mid border border-dashed border-black',
			)}
			aria-hidden='true'
		>
			{grade}
		</span>
	);
}
