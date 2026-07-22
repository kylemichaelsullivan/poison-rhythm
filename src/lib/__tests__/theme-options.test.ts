import { describe, expect, test } from 'bun:test';
import {
	THEME_OPTIONS,
	type ThemePreference,
	themeOptionFor,
} from '../theme-options';

describe('theme-options', () => {
	test('lists system, light, and dark preferences', () => {
		expect(THEME_OPTIONS.map((option) => option.value)).toEqual([
			null,
			'light',
			'dark',
		]);
	});

	test('resolves captions for each preference', () => {
		const cases: readonly ThemePreference[] = [null, 'light', 'dark'];
		for (const preference of cases) {
			expect(themeOptionFor(preference).value).toBe(preference);
			expect(themeOptionFor(preference).caption.length).toBeGreaterThan(0);
		}
	});

	test('falls back to system for unmatched values', () => {
		expect(themeOptionFor('not-a-theme' as ThemePreference).label).toBe(
			'System',
		);
	});
});
