import { expect, test } from '@playwright/test';
import {
	clickPause,
	clickPlay,
	generateRound,
	seedPlaybackPrefs,
} from './helpers';

test.describe('scroll highway', () => {
	test('scrolls during count-in and keeps progress monotonic', async ({
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
		await clickPlay(page);
		await expect(playControls).toHaveAttribute('data-counting-in', 'true');
		await expect(highway).toHaveAttribute('data-counting-in', 'true');

		const samples: number[] = [];
		for (let i = 0; i < 12; i += 1) {
			await page.waitForTimeout(120);
			const progress = Number(await highway.getAttribute('data-progress'));
			const transform = await track.evaluate(
				(node) => getComputedStyle(node).transform,
			);
			expect(transform).not.toBe('none');
			samples.push(progress);
		}

		const deltas = samples.slice(1).map((value, index) => {
			const previous = samples[index];
			return previous === undefined ? 0 : value - previous;
		});
		const backwardJumps = deltas.filter((delta) => delta < -0.05);
		expect(backwardJumps).toHaveLength(0);
		const first = samples[0];
		const last = samples[samples.length - 1];
		expect(first).toBeDefined();
		expect(last).toBeDefined();
		if (first !== undefined && last !== undefined) {
			expect(last).toBeGreaterThan(first);
		}

		await clickPause(page);
	});
});
