export type ThemePreference = 'light' | 'dark' | null;

export type ThemeOption = {
	readonly value: ThemePreference;
	readonly label: string;
	readonly caption: string;
};

export const THEME_OPTIONS = [
	{
		value: null,
		label: 'Match System',
		caption: 'Match System',
	},
	{
		value: 'light',
		label: 'Light Mode',
		caption: 'Light Mode',
	},
	{
		value: 'dark',
		label: 'Dark Mode',
		caption: 'Dark Mode',
	},
] as const satisfies readonly ThemeOption[];

export function themeOptionFor(theme: ThemePreference): ThemeOption {
	return (
		THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0]
	);
}

/**
 * Score-bar theme control (preference, not effective appearance):
 * - Light Mode + Light bar → Match System
 * - Light Mode + Dark bar → Dark Mode
 * - Dark Mode + Light bar → Light Mode
 * - Dark Mode + Dark bar → Match System
 * - Match System + either bar → lock that mode
 *
 * Meter bars stay Light-over-Dark visually (no `.ThemeScoreStack` reorder)
 * so the same bar stays under the pointer across clicks.
 */
export function nextThemePreference(
	current: ThemePreference,
	clicked: 'light' | 'dark',
): ThemePreference {
	return current === clicked ? null : clicked;
}
