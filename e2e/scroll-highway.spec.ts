import { expect, test } from '@playwright/test';
import {
	clickPause,
	clickPlay,
	generateRound,
	seedPlaybackPrefs,
} from './helpers';

test.describe('scroll highway', () => {
	test('scrolls through the lead-in measure during count-in then keeps advancing', async ({
		page,
	}) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 90,
			subdivision: 'quarters',
			rhythmRenderMode: 'scroll',
			scrollDirection: 'down',
		});
		await page.goto('/');
		await generateRound(page);

		const slider = page.getByTestId('measure-slider');
		const highway = slider.getByTestId('scroll-highway');
		const track = slider.getByTestId('scroll-highway-track');
		const playControls = page.getByTestId('play-controls');

		await expect(highway).toBeVisible();
		await expect(track.locator('[data-note-id]').first()).toBeVisible();
		await expect(highway).toHaveAttribute('data-progress', '-1.000');

		await clickPlay(page);
		await expect(playControls).toHaveAttribute('data-counting-in', 'true');
		await expect(highway).toHaveAttribute('data-counting-in', 'true');

		const countInSamples: number[] = [];
		for (let i = 0; i < 12; i += 1) {
			await page.waitForTimeout(100);
			const stillCounting =
				(await playControls.getAttribute('data-counting-in')) === 'true';
			if (!stillCounting) break;
			countInSamples.push(Number(await highway.getAttribute('data-progress')));
		}

		expect(countInSamples.length).toBeGreaterThan(1);
		const firstCountIn = countInSamples[0];
		const lastCountIn = countInSamples[countInSamples.length - 1];
		expect(firstCountIn).toBeDefined();
		expect(lastCountIn).toBeDefined();
		if (firstCountIn !== undefined && lastCountIn !== undefined) {
			expect(firstCountIn).toBeLessThan(0);
			expect(lastCountIn).toBeGreaterThan(firstCountIn);
		}

		const countInDeltas = countInSamples.slice(1).map((value, index) => {
			const previous = countInSamples[index];
			return previous === undefined ? 0 : value - previous;
		});
		expect(countInDeltas.filter((delta) => delta < -0.05)).toHaveLength(0);

		await expect(playControls).toHaveAttribute('data-counting-in', 'false', {
			timeout: 8000,
		});
		await expect(highway).toHaveAttribute('data-counting-in', 'false');

		const playbackSamples: number[] = [];
		for (let i = 0; i < 10; i += 1) {
			await page.waitForTimeout(120);
			playbackSamples.push(Number(await highway.getAttribute('data-progress')));
		}

		const first = playbackSamples[0];
		const last = playbackSamples[playbackSamples.length - 1];
		expect(first).toBeDefined();
		expect(last).toBeDefined();
		if (first !== undefined && last !== undefined) {
			expect(last).toBeGreaterThan(first);
		}

		const deltas = playbackSamples.slice(1).map((value, index) => {
			const previous = playbackSamples[index];
			return previous === undefined ? 0 : value - previous;
		});
		expect(deltas.filter((delta) => delta < -0.05)).toHaveLength(0);

		await clickPause(page);
	});
});
