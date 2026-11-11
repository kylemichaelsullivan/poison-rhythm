import { expect, test } from '@playwright/test';
import { TIMED_NOTICE_DURATION_MS } from '../src/lib/timed-notice';
import { generateRound, seedPlaybackPrefs } from './helpers';

test.describe('status toast', () => {
	test.beforeEach(async ({ page }) => {
		await seedPlaybackPrefs(page, {
			countIn: false,
			demoBeforePlay: false,
		});
		await page.goto('/');
		await generateRound(page);
	});

	test('shows a lower-right toast when Show Next Measure toggles on the screen', async ({
		page,
	}) => {
		const eye = page.getByRole('button', { name: /Show Next Measure/i });
		await expect(eye).toBeVisible();
		await eye.click();

		const toast = page.getByTestId('status-toast');
		await expect(toast).toBeVisible();
		await expect(toast).toHaveText('Show Next Measure: Off');

		const box = await toast.boundingBox();
		const viewport = page.viewportSize();
		expect(box).toBeTruthy();
		expect(viewport).toBeTruthy();
		if (!box || !viewport) return;
		expect(box.x + box.width).toBeGreaterThan(viewport.width * 0.55);
		expect(box.y).toBeGreaterThan(viewport.height * 0.45);

		await expect(toast).toBeHidden({
			timeout: TIMED_NOTICE_DURATION_MS + 1500,
		});
	});

	test('does not toast for Settings → Mode practice toggles', async ({
		page,
	}) => {
		await page.getByRole('button', { name: 'Settings' }).click();
		const dialog = page.getByRole('dialog', { name: 'Settings' });
		await expect(dialog).toBeVisible();
		await dialog.getByRole('tab', { name: 'Mode' }).click();

		const settingsToggle = dialog.getByRole('button', {
			name: /Show Next Measure/i,
		});
		await expect(settingsToggle).toBeVisible();
		await settingsToggle.click();

		await expect(page.getByTestId('status-toast')).toHaveCount(0);
	});
});
