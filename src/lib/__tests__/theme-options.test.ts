import { describe, expect, test } from 'bun:test';
import {
	nextThemePreference,
	THEME_OPTIONS,
	type ThemePreference,
	themeOptionFor,
} from '../theme-options';

describe('theme-options', () => {
	test('lists Match System, Light Mode, and Dark Mode', () => {
		expect(THEME_OPTIONS.map((option) => option.label)).toEqual([
			'Match System',
			'Light Mode',
			'Dark Mode',
		]);
	});

	test('resolves labels for each preference', () => {
		const cases: readonly ThemePreference[] = [null, 'light', 'dark'];
		for (const preference of cases) {
			expect(themeOptionFor(preference).value).toBe(preference);
			expect(themeOptionFor(preference).label.length).toBeGreaterThan(0);
		}
	});

	test('falls back to Match System for unmatched values', () => {
		expect(themeOptionFor('not-a-theme' as ThemePreference).label).toBe(
			'Match System',
		);
	});

	test('score-bar taps follow Light/Dark → Match System switching', () => {
		expect(nextThemePreference('light', 'light')).toBeNull();
		expect(nextThemePreference('light', 'dark')).toBe('dark');
		expect(nextThemePreference('dark', 'light')).toBe('light');
		expect(nextThemePreference('dark', 'dark')).toBeNull();
		expect(nextThemePreference(null, 'light')).toBe('light');
		expect(nextThemePreference(null, 'dark')).toBe('dark');
	});
});
