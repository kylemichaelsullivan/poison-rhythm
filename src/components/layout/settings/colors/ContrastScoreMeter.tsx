import { useId } from 'react';
import type { ContrastRating } from '@/lib/colors';
import { worseContrastRating } from '@/lib/colors';
import type { ThemePreference } from '@/lib/theme-options';
import { themeOptionFor } from '@/lib/theme-options';
import { FieldCaption } from '../FieldCaption';
import { ThemeScoreRow } from './ThemeScoreRow';

const ROWS = ['light', 'dark'] as const;

type ContrastScoreMeterProps = {
	light: ContrastRating;
	dark: ContrastRating;
	theme: ThemePreference;
	/** Tap a bar to lock that theme (or cycle toward System via parent). */
	onThemeModeSelect: (mode: 'light' | 'dark') => void;
	themeCaption: string;
};

/**
 * Light/Dark grades for the chosen pair in one joined box. Each row is a
 * theme button. Visual order stays Light over Dark, matching swatch chips,
 * so click targets do not swap when the theme changes.
 */
export function ContrastScoreMeter({
	light,
	dark,
	theme,
	onThemeModeSelect,
	themeCaption,
}: ContrastScoreMeterProps) {
	const captionId = useId();
	const scores = { light, dark };
	const limiting = worseContrastRating(light, dark);
	const selectedOption = themeOptionFor(theme);

	return (
		<div className='ContrastScoreMeter flex flex-col gap-2'>
			<fieldset
				className='m-0 flex w-full min-w-0 flex-col overflow-hidden rounded-md border-2 border-solid border-black p-0'
				aria-label={`Light Mode grade ${light.grade}, ${light.ratio.toFixed(1)} to 1. Dark Mode grade ${dark.grade}, ${dark.ratio.toFixed(1)} to 1.`}
				aria-describedby={captionId}
				data-testid='contrast-score-meter'
				data-contrast-grade={limiting.grade}
				data-contrast-grade-light={light.grade}
				data-contrast-grade-dark={dark.grade}
				data-contrast={limiting.level}
				data-theme-preference={
					selectedOption.value == null ? 'system' : selectedOption.value
				}
			>
				{ROWS.map((mode) => (
					<ThemeScoreRow
						key={mode}
						mode={mode}
						rating={scores[mode]}
						selected={theme === mode}
						describedBy={captionId}
						onSelect={() => onThemeModeSelect(mode)}
					/>
				))}
			</fieldset>
			<FieldCaption id={captionId}>{themeCaption}</FieldCaption>
		</div>
	);
}
