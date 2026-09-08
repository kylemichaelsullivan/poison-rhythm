import { expect, test } from '@playwright/test';

async function switchToNotation(page: import('@playwright/test').Page) {
	await page.getByRole('button', { name: 'Change Display Mode' }).click();
	await page.getByRole('button', { name: 'Notation', exact: true }).click();
	await page.keyboard.press('Escape');
}

function inspectNotationBoxes(page: import('@playwright/test').Page) {
	return page.evaluate(() => {
		const roots = [
			document.querySelector('[data-testid="measure-slider"]'),
			document.querySelector('.PoisonMeasureFrame'),
		].filter(Boolean);

		return roots.flatMap((root) => {
			const lines = [...(root?.querySelectorAll('.MeasureNotationLine') ?? [])];
			const notations = [...(root?.querySelectorAll('.MeasureNotation') ?? [])];
			return [...lines, ...notations].map((el) => ({
				className: el.className.split(' ')[0],
				clientHeight: el.clientHeight,
				scrollHeight: el.scrollHeight,
				hasVerticalOverflow: el.scrollHeight > el.clientHeight,
			}));
		});
	});
}

test.describe('notation scroll overflow', () => {
	test('notation boxes fit MusiSync glyphs without vertical overflow', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.getByTestId('measure-slider')).toBeVisible();
		await switchToNotation(page);

		for (let round = 0; round < 8; round += 1) {
			if (round > 0) {
				await page.getByRole('button', { name: 'New' }).click();
				await expect(page.getByTestId('measure-slider')).toBeVisible();
			}

			const line = page
				.getByTestId('measure-slider')
				.locator('.MeasureNotationLine')
				.first();
			await expect(line).toBeVisible({ timeout: 10_000 });

			const boxes = await inspectNotationBoxes(page);
			expect(boxes.length).toBeGreaterThan(0);
			for (const box of boxes) {
				expect(
					box.hasVerticalOverflow,
					`round ${round}: ${box.className} scrollHeight ${box.scrollHeight} > clientHeight ${box.clientHeight}`,
				).toBe(false);
			}
		}

		const line = page
			.getByTestId('measure-slider')
			.locator('.MeasureNotationLine')
			.first();
		await line.hover();
		await page.mouse.wheel(0, 120);
		const scrollTopAfterWheel = await line.evaluate((el) => el.scrollTop);
		expect(scrollTopAfterWheel).toBe(0);
	});
});
