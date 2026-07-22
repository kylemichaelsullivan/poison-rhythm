import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import {
	MUTE_METRONOME_STORAGE_KEY,
	MUTE_RHYTHM_STORAGE_KEY,
	readMutePreference,
	writeMutePreference,
} from '../mute-preferences';

const memoryStore = new Map<string, string>();

beforeAll(() => {
	const localStorageMock = {
		getItem(key: string) {
			return memoryStore.has(key) ? (memoryStore.get(key) ?? null) : null;
		},
		setItem(key: string, value: string) {
			memoryStore.set(key, String(value));
		},
		removeItem(key: string) {
			memoryStore.delete(key);
		},
		clear() {
			memoryStore.clear();
		},
	};

	Object.defineProperty(globalThis, 'localStorage', {
		value: localStorageMock,
		configurable: true,
	});
});

describe('mute-preferences', () => {
	afterEach(() => {
		memoryStore.clear();
	});

	test('reads false when nothing is stored', () => {
		expect(readMutePreference(MUTE_METRONOME_STORAGE_KEY)).toBe(false);
		expect(readMutePreference(MUTE_RHYTHM_STORAGE_KEY)).toBe(false);
	});

	test('persists muted as true and clears on unmute', () => {
		writeMutePreference(MUTE_METRONOME_STORAGE_KEY, true);
		expect(localStorage.getItem(MUTE_METRONOME_STORAGE_KEY)).toBe('true');
		expect(readMutePreference(MUTE_METRONOME_STORAGE_KEY)).toBe(true);

		writeMutePreference(MUTE_METRONOME_STORAGE_KEY, false);
		expect(localStorage.getItem(MUTE_METRONOME_STORAGE_KEY)).toBeNull();
		expect(readMutePreference(MUTE_METRONOME_STORAGE_KEY)).toBe(false);
	});

	test('ignores non-true stored values', () => {
		localStorage.setItem(MUTE_RHYTHM_STORAGE_KEY, 'yes');
		expect(readMutePreference(MUTE_RHYTHM_STORAGE_KEY)).toBe(false);
	});
});
