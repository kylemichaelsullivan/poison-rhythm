import clsx from 'clsx';
import {
	type ColorThemeMode,
	type ContrastGrade,
	contrastGradePasses,
} from '@/lib/colors';
import {
	stableDarkInkClassName,
	stableLightInkClassName,
} from '@/lib/control-classes';

type ContrastGradeBadgeProps = {
	grade: ContrastGrade;
	mode: ColorThemeMode;
};

function gradeBadgeChrome(grade: ContrastGrade): string {
	if (contrastGradePasses(grade)) return stableDarkInkClassName;
	if (grade === 'C') {
		return clsx(stableLightInkClassName, 'border border-ink-950');
	}
	if (grade === 'D') {
		return clsx(stableLightInkClassName, 'border border-dashed border-ink-950');
	}
	return 'bg-ink-100 text-ink-400 border border-dashed border-ink-950';
}

/** Letter-grade chip on a crayon swatch. */
export function ContrastGradeBadge({ grade, mode }: ContrastGradeBadgeProps) {
	return (
		<span
			className={clsx(
				'ContrastGradeBadge pointer-events-none flex size-4 items-center justify-center rounded-sm text-[10px] font-black leading-none',
				gradeBadgeChrome(grade),
			)}
			data-contrast-mode={mode}
			data-contrast-grade={grade}
			aria-hidden='true'
		>
			{grade}
		</span>
	);
}
