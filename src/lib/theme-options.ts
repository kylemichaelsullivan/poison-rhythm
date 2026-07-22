export type ThemePreference = 'light' | 'dark' | null;

export type ThemeOption = {
	readonly value: ThemePreference;
	readonly label: string;
	readonly caption: string;
};

export const THEME_OPTIONS = [
	{
		value: null,
		label: 'System',
		caption: 'Follows your device’s appearance setting.',
	},
	{
		value: 'light',
		label: 'Light',
		caption: 'Light, no matter your device’s appearance.',
	},
	{
		value: 'dark',
		label: 'Dark',
		caption: 'Dark, no matter your device’s appearance.',
	},
] as const satisfies readonly ThemeOption[];

export function themeOptionFor(theme: ThemePreference): ThemeOption {
	return (
		THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0]
	);
}
