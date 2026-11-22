/**
 * Device-scoped keys stay global on this browser.
 * Profile-scoped prefs are namespaced: `poison-rhythm:{profileId}:{suffix}`.
 */

export const DEVICE_STORAGE_KEYS = {
	introSeen: 'poison-rhythm-intro-seen',
	profiles: 'poison-rhythm-profiles-v1',
} as const;

/** Stable id for the first device profile (migration + e2e seeding). */
export const DEFAULT_PROFILE_ID = 'default';

export const DEFAULT_PROFILE_NAME = 'Default';

/** Flat keys from before profiles — read once during migration. */
export const FLAT_PROFILE_STORAGE_KEYS = {
	theme: 'poison-rhythm-theme',
	subdivision: 'poison-rhythm-subdivision',
	muteMetronome: 'poison-rhythm-mute-metronome',
	mutePlayback: 'poison-rhythm-mute-playback',
	mutePreview: 'poison-rhythm-mute-preview',
	countInEnabled: 'poison-rhythm-count-in-enabled',
	difficulty: 'poison-rhythm-difficulty',
	tempo: 'poison-rhythm-tempo',
	tempoMin: 'poison-rhythm-tempo-min',
	tempoMax: 'poison-rhythm-tempo-max',
	dominantColor: 'poison-rhythm-dominant-color',
	secondaryColor: 'poison-rhythm-secondary-color',
	gameSettings: 'poison-rhythm-settings-v1',
} as const;

/** Suffix after `poison-rhythm:{profileId}:`. */
export const PROFILE_PREF_SUFFIXES = {
	theme: 'theme',
	subdivision: 'subdivision',
	muteMetronome: 'mute-metronome',
	mutePlayback: 'mute-playback',
	mutePreview: 'mute-preview',
	countInEnabled: 'count-in-enabled',
	difficulty: 'difficulty',
	tempo: 'tempo',
	tempoMin: 'tempo-min',
	tempoMax: 'tempo-max',
	dominantColor: 'dominant-color',
	secondaryColor: 'secondary-color',
	gameSettings: 'settings-v1',
} as const;

export type ProfilePreferenceKeyName = keyof typeof PROFILE_PREF_SUFFIXES;

/** Legacy mute keys kept for one-time migration reads. */
export const LEGACY_STORAGE_KEYS = {
	muteCountIn: 'poison-rhythm-mute-count-in',
	muteRhythm: 'poison-rhythm-mute-rhythm',
} as const;

export type PreferenceKeyName = ProfilePreferenceKeyName | 'introSeen';

export function preferenceStorageKey(
	name: PreferenceKeyName,
	profileId: string = DEFAULT_PROFILE_ID,
): string {
	if (name === 'introSeen') {
		return DEVICE_STORAGE_KEYS.introSeen;
	}
	return `poison-rhythm:${profileId}:${PROFILE_PREF_SUFFIXES[name]}`;
}

/**
 * Convenience keys for the default profile and device scope.
 * Prefer `preferenceStorageKey(name, activeProfileId)` at runtime.
 */
export const STORAGE_KEYS = {
	theme: preferenceStorageKey('theme'),
	subdivision: preferenceStorageKey('subdivision'),
	muteMetronome: preferenceStorageKey('muteMetronome'),
	mutePlayback: preferenceStorageKey('mutePlayback'),
	mutePreview: preferenceStorageKey('mutePreview'),
	countInEnabled: preferenceStorageKey('countInEnabled'),
	difficulty: preferenceStorageKey('difficulty'),
	tempo: preferenceStorageKey('tempo'),
	tempoMin: preferenceStorageKey('tempoMin'),
	tempoMax: preferenceStorageKey('tempoMax'),
	dominantColor: preferenceStorageKey('dominantColor'),
	secondaryColor: preferenceStorageKey('secondaryColor'),
	gameSettings: preferenceStorageKey('gameSettings'),
	introSeen: DEVICE_STORAGE_KEYS.introSeen,
	profiles: DEVICE_STORAGE_KEYS.profiles,
} as const;

/** @deprecated Use STORAGE_KEYS.muteMetronome */
export const MUTE_METRONOME_STORAGE_KEY = STORAGE_KEYS.muteMetronome;
/** @deprecated Use LEGACY_STORAGE_KEYS.muteCountIn */
export const MUTE_COUNT_IN_STORAGE_KEY = LEGACY_STORAGE_KEYS.muteCountIn;
/** @deprecated Use STORAGE_KEYS.countInEnabled */
export const COUNT_IN_ENABLED_STORAGE_KEY = STORAGE_KEYS.countInEnabled;
/** @deprecated Use STORAGE_KEYS.mutePlayback / STORAGE_KEYS.mutePreview */
export const MUTE_RHYTHM_STORAGE_KEY = LEGACY_STORAGE_KEYS.muteRhythm;
