import clsx from 'clsx';
import DarkIcon from '@/assets/svg/dark.svg?react';
import LightIcon from '@/assets/svg/light.svg?react';
import { Icon } from '@/components/layout/Icon';
import type { ContrastRating } from '@/lib/colors';
import { contrastGradePasses } from '@/lib/colors';
import { interactiveInsetChromeClassName } from '@/lib/control-classes';
import { themeOptionFor } from '@/lib/theme-options';

type ThemeScoreRowProps = {
	mode: 'light' | 'dark';
	rating: ContrastRating;
	/** Exclusive Light or Dark preference matches this row. */
	selected: boolean;
	onSelect: () => void;
	describedBy?: string;
};

/**
 * Full-width Light Mode / Dark Mode score bar.
 * Lit bulb when selected; shaded bulb faded when idle. Tap again → Match System.
 */
export function ThemeScoreRow({
	mode,
	rating,
	selected,
	onSelect,
	describedBy,
}: ThemeScoreRowProps) {
	const isDark = mode === 'dark';
	const encourage = contrastGradePasses(rating.grade);
	const option = themeOptionFor(mode);
	const systemOption = themeOptionFor(null);

	return (
		<button
			type='button'
			className={clsx(
				'ThemeScoreRow flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-[box-shadow,filter]',
				interactiveInsetChromeClassName,
				selected && 'ring-2 ring-inset ring-primary',
				!selected &&
					(isDark ? 'hover:brightness-125' : 'hover:brightness-[0.97]'),
				isDark
					? encourage
						? 'bg-black text-white'
						: 'bg-black/80 text-white'
					: 'bg-chrome text-black',
			)}
			aria-label={`${option.label}, grade ${rating.grade}, ${rating.ratio.toFixed(1)} to 1`}
			aria-pressed={selected}
			aria-describedby={describedBy}
			title={selected ? systemOption.label : option.label}
			data-contrast-mode={mode}
			data-contrast-grade={rating.grade}
			data-contrast-ratio={rating.ratio.toFixed(1)}
			data-theme-selected={selected ? 'true' : 'false'}
			onClick={onSelect}
		>
			<span
				className={clsx(
					'shrink-0 transition-opacity',
					selected ? 'opacity-100' : 'opacity-40',
				)}
				aria-hidden='true'
			>
				<Icon svg={selected ? LightIcon : DarkIcon} size='sm' />
			</span>
			<span className='flex items-center justify-end gap-2'>
				<span className='text-lg font-bold leading-none tabular-nums'>
					{rating.ratio.toFixed(1)}:1
				</span>
				<span className='text-2xl font-black leading-none tracking-tight tabular-nums'>
					{rating.grade}
				</span>
			</span>
		</button>
	);
}
