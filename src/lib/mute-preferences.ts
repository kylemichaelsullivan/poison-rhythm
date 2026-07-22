export const MUTE_METRONOME_STORAGE_KEY = 'poison-rhythm-mute-metronome';
export const MUTE_RHYTHM_STORAGE_KEY = 'poison-rhythm-mute-rhythm';

export function readMutePreference(key: string): boolean {
	if (typeof globalThis.localStorage === 'undefined') {
		return false;
	}
	return globalThis.localStorage.getItem(key) === 'true';
}

export function writeMutePreference(key: string, muted: boolean): void {
	if (typeof globalThis.localStorage === 'undefined') {
		return;
	}
	if (muted) {
		globalThis.localStorage.setItem(key, 'true');
	} else {
		globalThis.localStorage.removeItem(key);
	}
}
