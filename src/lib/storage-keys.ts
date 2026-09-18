/** Local preference keys (student scope today; namespace ready for account tiers). */
export const PREFERENCE_SCOPE = 'student' as const;

export type PreferenceScope = typeof PREFERENCE_SCOPE;

const STUDENT_KEYS = {
	theme: 'poison-rhythm-theme',
	subdivision: 'poison-rhythm-subdivision',
	muteMetronome: 'poison-rhythm-mute-metronome',
	muteRhythm: 'poison-rhythm-mute-rhythm',
	countInEnabled: 'poison-rhythm-count-in-enabled',
	difficulty: 'poison-rhythm-difficulty',
	tempo: 'poison-rhythm-tempo',
	dominantColor: 'poison-rhythm-dominant-color',
	secondaryColor: 'poison-rhythm-secondary-color',
	gameSettings: 'poison-rhythm-settings-v1',
} as const;

/** Legacy keys kept for one-time migration reads. */
export const LEGACY_STORAGE_KEYS = {
	muteCountIn: 'poison-rhythm-mute-count-in',
} as const;

export type PreferenceKeyName = keyof typeof STUDENT_KEYS;

export function preferenceStorageKey(
	name: PreferenceKeyName,
	_scope: PreferenceScope = PREFERENCE_SCOPE,
): string {
	return STUDENT_KEYS[name];
}

export const STORAGE_KEYS = {
	theme: preferenceStorageKey('theme'),
	subdivision: preferenceStorageKey('subdivision'),
	muteMetronome: preferenceStorageKey('muteMetronome'),
	muteRhythm: preferenceStorageKey('muteRhythm'),
	countInEnabled: preferenceStorageKey('countInEnabled'),
	difficulty: preferenceStorageKey('difficulty'),
	tempo: preferenceStorageKey('tempo'),
	dominantColor: preferenceStorageKey('dominantColor'),
	secondaryColor: preferenceStorageKey('secondaryColor'),
	gameSettings: preferenceStorageKey('gameSettings'),
} as const;

/** @deprecated Use STORAGE_KEYS.muteMetronome */
export const MUTE_METRONOME_STORAGE_KEY = STORAGE_KEYS.muteMetronome;
/** @deprecated Use LEGACY_STORAGE_KEYS.muteCountIn */
export const MUTE_COUNT_IN_STORAGE_KEY = LEGACY_STORAGE_KEYS.muteCountIn;
/** @deprecated Use STORAGE_KEYS.countInEnabled */
export const COUNT_IN_ENABLED_STORAGE_KEY = STORAGE_KEYS.countInEnabled;
/** @deprecated Use STORAGE_KEYS.muteRhythm */
export const MUTE_RHYTHM_STORAGE_KEY = STORAGE_KEYS.muteRhythm;
