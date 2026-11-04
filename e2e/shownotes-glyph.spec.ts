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

async function expectNoteNotLetter(page: Page) {
	const button = page.getByRole('button', {
		name: 'Choose Which Note Subdivisions to Show',
	});
	await expect(button).toBeVisible();
	await expect(button).toHaveAttribute('data-musisync-ready', 'true', {
		timeout: 10_000,
	});

	const canvas = button.locator('canvas');
	await expect(canvas).toBeVisible();

	const painted = await canvas.evaluate((node) => {
		if (!(node instanceof HTMLCanvasElement)) {
			return { ink: 0, musiVsFallback: 0 };
		}
		const ctx = node.getContext('2d');
		if (!ctx) return { ink: 0, musiVsFallback: 0 };

		const { data } = ctx.getImageData(0, 0, node.width, node.height);
		let ink = 0;
		for (let i = 3; i < data.length; i += 4) {
			if (data[i] > 24) ink++;
		}

		const size = 64;
		const probe = document.createElement('canvas');
		probe.width = size;
		probe.height = size;
		const pctx = probe.getContext('2d');
		if (!pctx) return { ink, musiVsFallback: 0 };

		const paint = (font: string): Uint8ClampedArray => {
			pctx.clearRect(0, 0, size, size);
			pctx.font = font;
			pctx.textBaseline = 'alphabetic';
			pctx.fillStyle = '#000';
			pctx.fillText('qes', 4, 48);
			return pctx.getImageData(0, 0, size, size).data;
		};

		const musi = paint('34px "MusiSync", ui-monospace, monospace');
		const fallback = paint('34px ui-monospace, monospace');
		let musiVsFallback = 0;
		for (let i = 0; i < musi.length; i++) {
			if (musi[i] !== fallback[i]) musiVsFallback++;
		}

		return { ink, musiVsFallback };
	});

	expect(painted.ink).toBeGreaterThan(40);
	expect(painted.musiVsFallback).toBeGreaterThan(80);
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
		test(`paints a note, not a letter, in ${theme.name}`, async ({ page }) => {
			await seedTheme(page, theme.value);
			await page.emulateMedia({ colorScheme: theme.colorScheme });
			await page.goto('/');
			await generateRound(page);
			await expectNoteNotLetter(page);
		});
	}
});
