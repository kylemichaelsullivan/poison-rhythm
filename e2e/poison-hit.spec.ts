import { expect, test } from '@playwright/test';
import { clickPlay, generateRound, seedPlaybackPrefs } from './helpers';

test.describe('poison hit overlay', () => {
	test('shows a full-screen animation after Classic poison plays', async ({
		page,
	}) => {
		test.setTimeout(60_000);
		await seedPlaybackPrefs(page, {
			countIn: false,
			demoBeforePlay: false,
			tempo: 240,
			subdivision: 'quarters',
			rhythmRenderMode: 'grid',
		});
		await page.goto('/');
		await generateRound(page);

		await clickPlay(page);

		const overlay = page.getByTestId('poison-hit-overlay');
		await expect(overlay).toBeVisible({ timeout: 45000 });
		await expect(overlay.getByText('That’s the Poison!')).toBeVisible();
		await expect(overlay.getByText('You lose!')).toHaveCount(0);
		await expect(overlay.locator('.PoisonHitBottle')).toBeVisible();
		await expect(overlay.locator('.PoisonHitSplat')).toBeAttached();
		await expect(overlay.locator('.PoisonHitSplatBlob')).toBeAttached();

		await expect(overlay).toBeHidden({ timeout: 5000 });
	});

	test('does not show the overlay in Endless continuous play', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, {
			countIn: false,
			demoBeforePlay: false,
			tempo: 240,
			subdivision: 'quarters',
			rhythmRenderMode: 'grid',
		});
		await page.addInitScript((settingsKey) => {
			const raw = window.localStorage.getItem(settingsKey);
			if (!raw) return;
			const parsed = JSON.parse(raw) as Record<string, unknown>;
			parsed.endless = true;
			window.localStorage.setItem(settingsKey, JSON.stringify(parsed));
		}, 'poison-rhythm-settings-v1');

		await page.goto('/');
		await generateRound(page);
		await clickPlay(page);

		const overlay = page.getByTestId('poison-hit-overlay');
		const playControls = page.getByTestId('play-controls');

		// Wait through several measures; Endless must keep playing without overlay.
		await expect(playControls).toHaveAttribute('data-counting-in', 'false', {
			timeout: 5000,
		});
		await page.waitForTimeout(5000);
		await expect(overlay).toHaveCount(0);
		await expect(
			playControls.getByRole('button', { name: 'Pause' }),
		).toBeVisible();
	});
});
