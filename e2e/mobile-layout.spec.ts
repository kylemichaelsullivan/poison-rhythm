import { expect, test } from '@playwright/test';
import { generateRound } from './helpers';

test.describe('mobile layout', () => {
	test('carousel nav does not overlap Play and settings scrolls', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);

		const play = page.getByTestId('play-controls').getByRole('button').first();
		await expect(play).toBeVisible();

		const next = page.locator('.CarouselNavButton[aria-label="Next"]');
		const prev = page.locator('.CarouselNavButton[aria-label="Previous"]');

		// Default rounds have multiple measures; Next is enabled on the first slide.
		await expect(next).toBeVisible();
		const playBox = await play.boundingBox();
		const navBox = await next.boundingBox();
		expect(playBox).not.toBeNull();
		expect(navBox).not.toBeNull();
		if (playBox && navBox) {
			const overlaps =
				navBox.x < playBox.x + playBox.width &&
				navBox.x + navBox.width > playBox.x &&
				navBox.y < playBox.y + playBox.height &&
				navBox.y + navBox.height > playBox.y;
			expect(overlaps, 'carousel nav must not overlap Play').toBe(false);
			expect(navBox.y + navBox.height).toBeLessThanOrEqual(playBox.y + 1);
		}

		// Prev may be invisible when disabled; assert it does not steal Play space if shown.
		if (await prev.isVisible()) {
			const prevBox = await prev.boundingBox();
			if (playBox && prevBox) {
				expect(prevBox.y + prevBox.height).toBeLessThanOrEqual(playBox.y + 1);
			}
		}

		const measureGrid = page.locator('.MeasureCellGrid').first();
		if (await measureGrid.isVisible()) {
			const columns = await measureGrid.evaluate(
				(el) =>
					getComputedStyle(el).gridTemplateColumns.split(/\s+/).filter(Boolean)
						.length,
			);
			expect(columns).toBe(2);
		}

		await page.getByRole('button', { name: 'Settings' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('tab', { name: 'Look' }).click();
		const panel = page.locator('.SettingsTabPanel');
		await expect(panel).toBeVisible();
		await expect(panel).toHaveCSS('overflow-y', 'auto');
		await expect
			.poll(async () =>
				panel.evaluate((el) => el.scrollHeight > el.clientHeight),
			)
			.toBe(true);
	});
});
