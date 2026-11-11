import { expect, test } from '@playwright/test';
import { generateRound } from './helpers';
import type { Page } from '@playwright/test';

const THEME_KEY = 'poison-rhythm-theme';

async function seedTheme(page: Page, theme: 'light' | 'dark' | null) {
	await page.addInitScript(
		({ key, value }) => {
			if (value === null) {
				window.localStorage.removeItem(key);
			} else {
				window.localStorage.setItem(key, value);
			}
		},
		{ key: THEME_KEY, value: theme },
	);
}

async function expectSvgNoteGlyph(page: Page) {
	const button = page.getByRole('button', {
		name: 'Choose Which Note Subdivisions to Show',
	});
	await expect(button).toBeVisible();
	await expect(button).toHaveAttribute('data-notation-ready', 'true');

	const glyph = button.locator('[data-notation-glyph]');
	await expect(glyph).toBeVisible();
	await expect(glyph.locator('svg')).toBeVisible();

	const duration = await glyph.getAttribute('data-notation-glyph');
	expect(['quarter', 'eighth', 'sixteenth']).toContain(duration);

	const hasPathInk = await glyph.locator('svg').evaluate((svg) => {
		const shapes = svg.querySelectorAll('ellipse, path, line, circle, rect');
		return shapes.length > 0;
	});
	expect(hasPathInk).toBe(true);
}

const themes = [
	{
		name: 'Light Mode',
		value: 'light' as const,
		colorScheme: 'light' as const,
	},
	{ name: 'Dark Mode', value: 'dark' as const, colorScheme: 'dark' as const },
	{
		name: 'System Mode (light)',
		value: null,
		colorScheme: 'light' as const,
	},
	{
		name: 'System Mode (dark)',
		value: null,
		colorScheme: 'dark' as const,
	},
];

test.describe('ShowNotes trigger glyph', () => {
	for (const theme of themes) {
		test(`paints a note SVG in ${theme.name}`, async ({ page }) => {
			await seedTheme(page, theme.value);
			await page.emulateMedia({ colorScheme: theme.colorScheme });
			await page.goto('/');
			await generateRound(page);
			await expectSvgNoteGlyph(page);
		});
	}
});
