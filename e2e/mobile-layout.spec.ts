import { expect, test } from '@playwright/test';
import { generateRound, seedPlaybackPrefs } from './helpers';

test.describe('mobile layout', () => {
	test('carousel nav does not overlap Play and settings scrolls', async ({
		page,
	}) => {
		// Sixteenths stack to 2×2 on phones; default eighths stay four-across.
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			subdivision: 'sixteenths',
		});
		await page.goto('/');
		await generateRound(page);

		const play = page.getByTestId('play-controls').getByRole('button').first();
		await expect(play).toBeVisible();

		const next = page.getByRole('button', { name: 'Next', exact: true });
		const startPlay = page.getByTestId('carousel-start-play');
		const endMenu = page.getByTestId('carousel-end-menu');

		// First slide: delayed Play on the left; Next is enabled.
		await expect(startPlay).toBeVisible();
		await expect(startPlay).toBeEnabled();
		await expect(next).toBeVisible();
		await expect(next).toBeEnabled();
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

		const startBox = await startPlay.boundingBox();
		if (playBox && startBox) {
			expect(startBox.y + startBox.height).toBeLessThanOrEqual(playBox.y + 1);
		}

		for (let step = 0; step < 20 && (await next.isVisible()); step += 1) {
			await next.click();
		}
		await expect(endMenu).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Previous', exact: true }),
		).toBeEnabled();

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
		await page.getByRole('tab', { name: 'Colors' }).click();
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
