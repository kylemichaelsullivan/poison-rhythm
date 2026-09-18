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
		caption: 'Matches your device’s light or dark appearance.',
	},
	{
		value: 'light',
		label: 'Light',
		caption: 'Always light, ignoring your device’s appearance.',
	},
	{
		value: 'dark',
		label: 'Dark',
		caption: 'Always dark, ignoring your device’s appearance.',
	},
] as const satisfies readonly ThemeOption[];

export function themeOptionFor(theme: ThemePreference): ThemeOption {
	return (
		THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0]
	);
}
