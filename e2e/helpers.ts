import { expect, type Page } from '@playwright/test';

export const COUNT_IN_KEY = 'poison-rhythm-count-in-enabled';
export const SETTINGS_KEY = 'poison-rhythm-settings-v1';
export const TEMPO_KEY = 'poison-rhythm-tempo';
export const SUBDIVISION_KEY = 'poison-rhythm-subdivision';

export type PlaybackSeedOptions = {
	countIn: boolean;
	demoBeforePlay: boolean;
	tempo?: number;
	subdivision?: 'quarters' | 'eighths' | 'sixteenths';
};

export async function seedPlaybackPrefs(
	page: Page,
	options: PlaybackSeedOptions,
) {
	await page.addInitScript(
		({
			countIn,
			demoBeforePlay,
			tempo,
			subdivision,
			countInKey,
			settingsKey,
			tempoKey,
			subdivisionKey,
		}) => {
			if (countIn) {
				window.localStorage.removeItem(countInKey);
			} else {
				window.localStorage.setItem(countInKey, 'false');
			}

			if (typeof tempo === 'number') {
				window.localStorage.setItem(tempoKey, String(tempo));
			}

			if (subdivision) {
				window.localStorage.setItem(subdivisionKey, subdivision);
			}

			window.localStorage.setItem(
				settingsKey,
				JSON.stringify({
					players: 1,
					feedbackMode: 'both',
					scrollDirection: 'none',
					scrollSpeed: 'medium',
					accents: 'off',
					rests: 'off',
					phraseLength: 1,
					sticking: 'off',
					poisonMode: 'visible',
					gameMode: 'default',
					endless: false,
					rhythmRenderMode: 'grid',
					showNextMeasure: true,
					demoBeforePlay,
					muteOnStudentPass: false,
					endlessInitialBatch: 8,
					endlessAppendBatch: 8,
					endlessPrefetchRemaining: 3,
				}),
			);
		},
		{
			countIn: options.countIn,
			demoBeforePlay: options.demoBeforePlay,
			tempo: options.tempo,
			subdivision: options.subdivision,
			countInKey: COUNT_IN_KEY,
			settingsKey: SETTINGS_KEY,
			tempoKey: TEMPO_KEY,
			subdivisionKey: SUBDIVISION_KEY,
		},
	);
}

/** Wait for the auto-seeded first round (or after New) to be ready for play. */
export async function generateRound(page: Page) {
	await expect(page.getByTestId('measure-slider')).toBeVisible();
	const playButton = page
		.getByTestId('play-controls')
		.getByRole('button', { name: 'Play', exact: true });
	await expect(playButton).toBeEnabled();
}

export async function clickPlay(page: Page) {
	await page
		.getByTestId('play-controls')
		.getByRole('button', { name: 'Play', exact: true })
		.click();
}

export async function clickPause(page: Page) {
	await page
		.getByTestId('play-controls')
		.getByRole('button', { name: 'Pause', exact: true })
		.click();
}
