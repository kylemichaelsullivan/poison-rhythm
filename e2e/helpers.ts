import { expect } from '@playwright/test';
import {
	DEFAULT_PROFILE_ID,
	DEVICE_STORAGE_KEYS,
	preferenceStorageKey,
} from '../src/lib/storage-keys';
import type { Page } from '@playwright/test';

export const DEFAULT_E2E_PROFILE_ID = DEFAULT_PROFILE_ID;

export const COUNT_IN_KEY = preferenceStorageKey(
	'countInEnabled',
	DEFAULT_E2E_PROFILE_ID,
);
export const SETTINGS_KEY = preferenceStorageKey(
	'gameSettings',
	DEFAULT_E2E_PROFILE_ID,
);
export const TEMPO_KEY = preferenceStorageKey('tempo', DEFAULT_E2E_PROFILE_ID);
export const SUBDIVISION_KEY = preferenceStorageKey(
	'subdivision',
	DEFAULT_E2E_PROFILE_ID,
);
export const INTRO_SEEN_KEY = DEVICE_STORAGE_KEYS.introSeen;
export const PROFILES_KEY = DEVICE_STORAGE_KEYS.profiles;
export const MUTE_PLAYBACK_KEY = preferenceStorageKey(
	'mutePlayback',
	DEFAULT_E2E_PROFILE_ID,
);
export const MUTE_PREVIEW_KEY = preferenceStorageKey(
	'mutePreview',
	DEFAULT_E2E_PROFILE_ID,
);
export const MUTE_METRONOME_KEY = preferenceStorageKey(
	'muteMetronome',
	DEFAULT_E2E_PROFILE_ID,
);
export const THEME_KEY = preferenceStorageKey('theme', DEFAULT_E2E_PROFILE_ID);

export function defaultProfilesRegistryJson(name = 'Default'): string {
	return JSON.stringify({
		activeProfileId: DEFAULT_E2E_PROFILE_ID,
		profiles: [
			{
				id: DEFAULT_E2E_PROFILE_ID,
				name,
				createdAt: 0,
			},
		],
	});
}

/** Empty Playwright storage so the first-visit welcome can open. */
export const FIRST_VISIT_STORAGE_STATE = {
	cookies: [],
	origins: [],
};

export type PlaybackSeedOptions = {
	countIn: boolean;
	demoBeforePlay: boolean;
	tempo?: number;
	subdivision?: 'quarters' | 'eighths' | 'sixteenths';
	rhythmRenderMode?: 'grid' | 'notation' | 'scroll';
	scrollDirection?: 'none' | 'left' | 'right' | 'up' | 'down';
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
			rhythmRenderMode,
			scrollDirection,
			countInKey,
			settingsKey,
			tempoKey,
			subdivisionKey,
			profilesKey,
			profilesJson,
		}) => {
			window.localStorage.setItem(profilesKey, profilesJson);

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
					scrollDirection,
					scrollSpeed: 'medium',
					accents: 'off',
					rests: 'off',
					phraseLength: 1,
					sticking: 'off',
					poisonMode: 'visible',
					gameMode: 'default',
					endless: false,
					rhythmRenderMode,
					showNextMeasure: true,
					demoBeforePlay,
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
			rhythmRenderMode: options.rhythmRenderMode ?? 'grid',
			scrollDirection: options.scrollDirection ?? 'none',
			countInKey: COUNT_IN_KEY,
			settingsKey: SETTINGS_KEY,
			tempoKey: TEMPO_KEY,
			subdivisionKey: SUBDIVISION_KEY,
			profilesKey: PROFILES_KEY,
			profilesJson: defaultProfilesRegistryJson(),
		},
	);
}

/** Open About from the header brand title (not the Mode icon). */
export async function openAboutFromTitle(page: Page) {
	await page.locator('header .AppTitleBrandTrigger').click();
	await expect(
		page.getByRole('dialog', { name: 'About Poison Rhythm' }),
	).toBeVisible();
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
