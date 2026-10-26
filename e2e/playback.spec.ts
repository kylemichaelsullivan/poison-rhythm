import { expect, test } from '@playwright/test';
import { CAROUSEL_PLAY_DELAY_MS } from '../src/lib/timed-notice';
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
			tempo: 60,
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
		await expect(
			slider.locator('[data-playback-phase="listening"]'),
		).toBeVisible({
			timeout: 2_000,
		});
		await expect(
			slider.locator('[data-highlighted="true"]').first(),
		).toBeVisible({ timeout: 2_000 });

		await clickPause(page);
	});

	test('Escape stops playback while Play/Pause is focused', async ({
		page,
	}) => {
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
		await expect(
			playControls.getByRole('button', { name: 'Pause', exact: true }),
		).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(playControls).toHaveAttribute('data-counting-in', 'false');
		await expect(playControls).toHaveAttribute(
			'data-measures-playing',
			'false',
		);
		await expect(
			playControls.getByRole('button', { name: 'Play', exact: true }),
		).toBeVisible();
	});

	test('first-measure Play starts after a cancelable delay', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 60,
		});
		await page.goto('/');
		await generateRound(page);

		const playControls = page.getByTestId('play-controls');
		const startPlay = page.getByTestId('carousel-start-play');
		const startIcon = startPlay.locator('.Icon');
		const measuresTitle = page.getByRole('heading', {
			name: 'Measures',
			exact: true,
		});
		await expect(startPlay).toBeVisible();
		// Glyph stays in the tree (no layout shift). Playwright treats
		// opacity:0 as visible, so assert the rest hide via CSS.
		await measuresTitle.hover();
		await expect(startIcon).toHaveCSS('opacity', '0');

		await startPlay.click();
		await expect(startPlay).toHaveAttribute('data-armed', 'true');
		await expect(startIcon).toHaveCSS('opacity', '1');
		await expect(playControls).toHaveAttribute('data-counting-in', 'false');

		await startPlay.click();
		await expect(startPlay).toHaveAttribute('data-armed', 'false');
		await measuresTitle.click();
		await expect(startIcon).toHaveCSS('opacity', '0');
		await page.waitForTimeout(CAROUSEL_PLAY_DELAY_MS + 200);
		await expect(playControls).toHaveAttribute('data-counting-in', 'false');

		await startPlay.click();
		await expect(startPlay).toHaveAttribute('data-armed', 'true');
		await measuresTitle.click();
		await expect(startPlay).toHaveAttribute('data-armed', 'false');
		await page.waitForTimeout(CAROUSEL_PLAY_DELAY_MS + 200);
		await expect(playControls).toHaveAttribute('data-counting-in', 'false');

		await startPlay.click();
		await expect(playControls).toHaveAttribute('data-counting-in', 'true', {
			timeout: CAROUSEL_PLAY_DELAY_MS + 1500,
		});
		await expect(startPlay).toHaveAttribute('data-armed', 'false');
		await expect(startPlay).toBeDisabled();
		await expect(startIcon).toHaveCSS('opacity', '0');
		await clickPause(page);
	});

	test('last-measure menu can reuse or start a new set', async ({ page }) => {
		await seedPlaybackPrefs(page, {
			countIn: false,
			demoBeforePlay: false,
		});
		await page.goto('/');
		await generateRound(page);

		const next = page.getByRole('button', { name: 'Next', exact: true });
		for (let step = 0; step < 20 && (await next.isVisible()); step += 1) {
			await next.click();
		}

		const endMenu = page.getByTestId('carousel-end-menu');
		const menu = page.locator('.CarouselEndMenu');
		await expect(endMenu).toBeVisible();
		await endMenu.click();
		await menu.getByRole('button', { name: 'Reuse', exact: true }).click();
		await expect(page.getByTestId('carousel-start-play')).toBeVisible();

		for (let step = 0; step < 20 && (await next.isVisible()); step += 1) {
			await next.click();
		}
		await endMenu.click();
		await expect(
			menu.getByRole('button', { name: 'Play', exact: true }),
		).toBeVisible();
		await menu.getByRole('button', { name: 'New', exact: true }).click();
		await expect(page.getByTestId('carousel-start-play')).toBeVisible();
	});
});
