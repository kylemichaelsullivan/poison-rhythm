import DarkIcon from '@/assets/svg/dark.svg?react';
import LightIcon from '@/assets/svg/light.svg?react';
import type { SvgIconComponent } from '@/components/layout/Icon';
import { THEME_OPTIONS, type ThemePreference } from '@/lib';
import type { SegmentOption } from './SegmentButton';

const THEME_ICONS: Partial<
	Record<Exclude<ThemePreference, null>, SvgIconComponent>
> = {
	light: LightIcon,
	dark: DarkIcon,
};

export const THEME_SEGMENTS: readonly SegmentOption<ThemePreference>[] =
	THEME_OPTIONS.map((option) => ({
		value: option.value,
		label: option.label,
		icon: option.value != null ? THEME_ICONS[option.value] : undefined,
	}));
