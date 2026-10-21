import clsx from 'clsx';
import {
	type ColorThemeMode,
	type ContrastGrade,
	contrastGradePasses,
} from '@/lib/colors';

type ContrastGradeBadgeProps = {
	grade: ContrastGrade;
	mode: ColorThemeMode;
};

/** Letter-grade chip on a crayon swatch — ink chrome so fill cannot wash it out. */
export function ContrastGradeBadge({ grade, mode }: ContrastGradeBadgeProps) {
	const encourage = contrastGradePasses(grade);
	return (
		<span
			className={clsx(
				'ContrastGradeBadge pointer-events-none flex size-4 items-center justify-center rounded-sm text-[10px] font-black leading-none',
				encourage
					? 'bg-black text-white'
					: grade === 'C'
						? 'bg-chrome text-black border border-black'
						: grade === 'D'
							? 'bg-chrome text-black border border-dashed border-black'
							: 'bg-chrome text-mid border border-dashed border-black',
			)}
			data-contrast-mode={mode}
			data-contrast-grade={grade}
			aria-hidden='true'
		>
			{grade}
		</span>
	);
}
