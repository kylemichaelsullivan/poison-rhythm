import { expect, type Page, test } from '@playwright/test';

const THEME_KEY = 'poison-rhythm-theme';

async function seedTheme(page: Page, theme: 'light' | 'dark') {
	await page.addInitScript(
		({ key, value }) => {
			window.localStorage.setItem(key, value);
		},
		{ key: THEME_KEY, value: theme },
	);
}

async function openColors(page: Page) {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await page.getByRole('tab', { name: 'Colors' }).click();
	await expect(page.getByTestId('contrast-score-meter')).toBeVisible();
}

async function visualModes(page: Page, root: string) {
	return page
		.locator(root)
		.locator('[data-contrast-mode]')
		.evaluateAll((nodes) =>
			nodes
				.map((node) => ({
					mode: node.getAttribute('data-contrast-mode'),
					top: node.getBoundingClientRect().top,
				}))
				.sort((a, b) => a.top - b.top)
				.map((entry) => entry.mode),
		);
}

async function expectPreference(
	page: Page,
	preference: 'light' | 'dark' | 'system',
) {
	const meter = page.getByTestId('contrast-score-meter');
	await expect(meter).toHaveAttribute('data-theme-preference', preference);
	if (preference === 'system') {
		await expect(page.locator('html')).not.toHaveAttribute('data-theme');
	} else {
		await expect(page.locator('html')).toHaveAttribute(
			'data-theme',
			preference,
		);
	}
}

test.describe('color contrast scores', () => {
	test('light mode meter stays Light over Dark, shows grade and ratio', async ({
		page,
	}) => {
		await seedTheme(page, 'light');
		await openColors(page);

		const meter = page.getByTestId('contrast-score-meter');
		await expect(meter).toHaveAttribute('data-contrast-grade-light', 'B');
		await expect(meter).toHaveAttribute('data-contrast-grade-dark', 'A');
		const lightRow = meter.locator('[data-contrast-mode="light"]');
		const darkRow = meter.locator('[data-contrast-mode="dark"]');
		await expect(lightRow).toContainText('5.6:1');
		await expect(lightRow).toContainText('B');
		await expect(darkRow).toContainText('7.5:1');
		await expect(darkRow).toContainText('A');
		await expect
			.poll(async () =>
				lightRow.evaluate((row) => {
					const flex = row.querySelector('.flex.items-center.justify-end');
					const [ratio, grade] = flex
						? [...flex.children].map((child) =>
								(child.textContent ?? '').trim(),
							)
						: [];
					return { ratio, grade };
				}),
			)
			.toEqual({ ratio: '5.6:1', grade: 'B' });
		await expect(
			meter.getByRole('button', { name: /Light Mode/ }),
		).toHaveAttribute('aria-pressed', 'true');
		await expect(
			meter.getByRole('button', { name: /Dark Mode/ }),
		).toHaveAttribute('aria-pressed', 'false');
		const preview = page.getByTestId('color-pair-play-preview');
		await expect(preview).toBeVisible();
		await expect(preview.locator('[data-beat]')).toHaveCount(4);
		await expect(preview.locator('[data-highlighted="true"]')).toHaveCount(2);
		await expect(
			preview.locator(
				'[data-beat="1"] [data-highlighted="true"][title="Hit (current)"]',
			),
		).toHaveCount(1);
		await expect(
			preview.locator(
				'[data-beat="2"] [data-highlighted="true"][title="Rest (current)"]',
			),
		).toHaveCount(1);
		expect(
			await visualModes(page, '[data-testid="contrast-score-meter"]'),
		).toEqual(['light', 'dark']);

		const swatch = page.getByTestId('crayon-swatch-yellow');
		await expect(swatch).toHaveAttribute('aria-pressed', 'false');
		expect(
			await visualModes(page, '[data-testid="crayon-swatch-yellow"]'),
		).toEqual(['light', 'dark']);
		await expect(swatch).toHaveAttribute('aria-label', /Light Mode F/);
	});

	test('dominant picks are scored against the current secondary', async ({
		page,
	}) => {
		await seedTheme(page, 'light');
		await openColors(page);
		await page.getByRole('button', { name: /^Dominant:/ }).click();

		const yellow = page.getByTestId('crayon-swatch-yellow');
		await expect(yellow).toHaveAttribute('aria-label', /if chosen as Dominant/);
		await expect(yellow).toHaveAttribute('data-contrast-grade-light', 'F');
		await yellow.click();
		await expect(page.getByTestId('contrast-score-meter')).toHaveAttribute(
			'data-contrast-grade-light',
			'F',
		);
	});

	test('secondary picks are scored against the current dominant', async ({
		page,
	}) => {
		await seedTheme(page, 'light');
		await openColors(page);
		await page.getByRole('button', { name: /^Secondary:/ }).click();

		const black = page.getByTestId('crayon-swatch-black');
		await expect(black).toHaveAttribute('aria-label', /if chosen as Secondary/);
		const lightGrade = await black.getAttribute('data-contrast-grade-light');
		await black.click();
		await expect(page.getByTestId('contrast-score-meter')).toHaveAttribute(
			'data-contrast-grade-light',
			lightGrade ?? '',
		);
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Black');
	});

	test('swap exchanges Dominant and Secondary colors', async ({ page }) => {
		await seedTheme(page, 'light');
		await openColors(page);

		await page.getByRole('button', { name: /^Dominant:/ }).click();
		await page.getByTestId('crayon-swatch-yellow').click();
		await page.getByRole('button', { name: /^Secondary:/ }).click();
		await page.getByTestId('crayon-swatch-black').click();

		await expect(
			page.getByRole('button', { name: /^Dominant:/ }),
		).toContainText('Yellow');
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Black');

		await page
			.getByRole('button', { name: 'Swap Dominant and Secondary' })
			.click();

		await expect(
			page.getByRole('button', { name: /^Dominant:/ }),
		).toContainText('Black');
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Yellow');
	});

	test('swap exchanges brand defaults without a crayon preset', async ({
		page,
	}) => {
		await seedTheme(page, 'light');
		await openColors(page);

		await expect(
			page.getByRole('button', { name: /^Dominant:/ }),
		).toContainText('Poison Purple');
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Poison Mint');

		await page
			.getByRole('button', { name: 'Swap Dominant and Secondary' })
			.click();

		await expect(
			page.getByRole('button', { name: /^Dominant:/ }),
		).toContainText('Poison Mint');
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Poison Purple');

		await page
			.getByRole('button', { name: 'Swap Dominant and Secondary' })
			.click();

		await expect(
			page.getByRole('button', { name: /^Dominant:/ }),
		).toContainText('Poison Purple');
		await expect(
			page.getByRole('button', { name: /^Secondary:/ }),
		).toContainText('Poison Mint');
		await expect(
			page.getByRole('button', {
				name: 'Poison Rhythm · Default Purple and a green complement.',
			}),
		).toHaveAttribute('aria-pressed', 'true');
	});

	test('dark mode keeps meter Light over Dark; swatches put Dark on top', async ({
		page,
	}) => {
		await seedTheme(page, 'dark');
		await openColors(page);

		expect(
			await visualModes(page, '[data-testid="contrast-score-meter"]'),
		).toEqual(['light', 'dark']);
		expect(
			await visualModes(page, '[data-testid="crayon-swatch-yellow"]'),
		).toEqual(['dark', 'light']);

		await page.getByRole('button', { name: /^Secondary:/ }).click();
		expect(
			await visualModes(page, '[data-testid="crayon-swatch-black"]'),
		).toEqual(['dark', 'light']);
		await expect(page.getByTestId('crayon-swatch-black')).toHaveAttribute(
			'aria-label',
			/if chosen as Secondary/,
		);
	});

	test('Light → Dark → Match System → Dark keeps the same Dark Mode bar', async ({
		page,
	}) => {
		await seedTheme(page, 'light');
		await openColors(page);

		const meter = page.getByTestId('contrast-score-meter');
		const lightBar = meter.getByRole('button', { name: /Light Mode/ });
		const darkBar = meter.getByRole('button', { name: /Dark Mode/ });

		await expectPreference(page, 'light');
		expect(
			await visualModes(page, '[data-testid="contrast-score-meter"]'),
		).toEqual(['light', 'dark']);

		await darkBar.click();
		await expectPreference(page, 'dark');
		await expect(darkBar).toHaveAttribute('aria-pressed', 'true');
		await expect(lightBar).toHaveAttribute('aria-pressed', 'false');
		expect(
			await visualModes(page, '[data-testid="contrast-score-meter"]'),
		).toEqual(['light', 'dark']);

		await darkBar.click();
		await expectPreference(page, 'system');
		await expect(darkBar).toHaveAttribute('aria-pressed', 'false');
		await expect(lightBar).toHaveAttribute('aria-pressed', 'false');
		await expect(page.getByText('Match System')).toBeVisible();

		await darkBar.click();
		await expectPreference(page, 'dark');
		await expect(darkBar).toHaveAttribute('aria-pressed', 'true');
	});

	test('Dark → Light → Match System → Light keeps the same Light Mode bar', async ({
		page,
	}) => {
		await seedTheme(page, 'dark');
		await openColors(page);

		const meter = page.getByTestId('contrast-score-meter');
		const lightBar = meter.getByRole('button', { name: /Light Mode/ });
		const darkBar = meter.getByRole('button', { name: /Dark Mode/ });

		await expectPreference(page, 'dark');

		await lightBar.click();
		await expectPreference(page, 'light');
		await expect(lightBar).toHaveAttribute('aria-pressed', 'true');

		await lightBar.click();
		await expectPreference(page, 'system');
		await expect(lightBar).toHaveAttribute('aria-pressed', 'false');
		await expect(darkBar).toHaveAttribute('aria-pressed', 'false');

		await lightBar.click();
		await expectPreference(page, 'light');
		await expect(lightBar).toHaveAttribute('aria-pressed', 'true');
	});
});
