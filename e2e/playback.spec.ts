import { expect, test } from '@playwright/test';
import {
	clickPause,
	clickPlay,
	generateRound,
	seedPlaybackPrefs,
} from './helpers';

test.describe('measure playback', () => {
	test('loads the app and can generate a round', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Poison Rhythm/);
		await generateRound(page);
	});

	test('does not highlight the first note during count-in', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 30,
		});
		await page.goto('/');
		await generateRound(page);

		const slider = page.getByTestId('measure-slider');
		const playControls = page.getByTestId('play-controls');

		await clickPlay(page);
		await expect(playControls).toHaveAttribute('data-counting-in', 'true');
		await expect(playControls).toHaveAttribute(
			'data-measures-playing',
			'false',
		);
		await expect(slider.locator('[data-highlighted="true"]')).toHaveCount(0);

		await clickPause(page);
	});

	test('shows count-in beats on the play button', async ({ page }) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 60,
		});
		await page.goto('/');
		await generateRound(page);

		const playControls = page.getByTestId('play-controls');

		await clickPlay(page);
		await expect(playControls).toHaveAttribute('data-counting-in', 'true');

		const pauseButton = playControls.getByRole('button', {
			name: 'Pause',
			exact: true,
		});

		await expect(playControls).toHaveAttribute('data-count-in-beat', '1', {
			timeout: 3_000,
		});
		await expect(pauseButton).toHaveAttribute('data-count-beat', '1');

		await expect(playControls).toHaveAttribute('data-count-in-beat', '2', {
			timeout: 2_000,
		});
		await expect(pauseButton).toHaveAttribute('data-count-beat', '2');

		await clickPause(page);
	});

	test('highlights notes after count-in when playback starts', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 180,
			subdivision: 'quarters',
		});
		await page.goto('/');
		await generateRound(page);

		const slider = page.getByTestId('measure-slider');
		const playControls = page.getByTestId('play-controls');

		await clickPlay(page);
		await expect(playControls).toHaveAttribute('data-counting-in', 'true');

		// Count-in is ~1.33s at 180 BPM (+ lead); look-ahead joins playback without a timer gap.
		await expect(playControls).toHaveAttribute('data-counting-in', 'false', {
			timeout: 8_000,
		});
		await expect(
			slider.locator('[data-highlighted="true"]').first(),
		).toBeVisible({ timeout: 1_000 });
		await expect(playControls).toHaveAttribute('data-measures-playing', 'true');

		await clickPause(page);
	});

	test('preview before play highlights measure during demo pass', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, { countIn: false, demoBeforePlay: true });
		await page.goto('/');
		await generateRound(page);

		await clickPlay(page);

		const slider = page.getByTestId('measure-slider');
		await expect(slider.getByText('Listening', { exact: true })).toBeVisible({
			timeout: 2_000,
		});
		await expect(
			slider.locator('[data-highlighted="true"]').first(),
		).toBeVisible({ timeout: 2_000 });

		await clickPause(page);
	});
});
