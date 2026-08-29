import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { BPM_DEFAULT } from '../metronome-defaults';
import {
	parseCountInEnabledStored,
	parseDifficulty,
	parseExplicitTrue,
	parseStoredTempo,
	parseSubdivisionLevel,
	parseThemeSetting,
	readCountInEnabled,
	readDifficulty,
	readMuteMetronome,
	readStoredTempo,
	resetPreferenceBootstrapForTests,
	resolveInitialTempo,
	writeCountInEnabled,
	writeDifficulty,
	writeMuteMetronome,
	writeStoredTempo,
	writeThemeSetting,
} from '../preference-storage';
import {
	COUNT_IN_ENABLED_STORAGE_KEY,
	LEGACY_STORAGE_KEYS,
	MUTE_METRONOME_STORAGE_KEY,
	MUTE_RHYTHM_STORAGE_KEY,
	STORAGE_KEYS,
} from '../storage-keys';

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

describe('preference-schemas', () => {
	test('parses theme and subdivision with zod allowlists', () => {
		expect(parseThemeSetting('dark')).toBe('dark');
		expect(parseThemeSetting('system')).toBeNull();
		expect(parseSubdivisionLevel('sixteenths')).toBe('sixteenths');
		expect(parseSubdivisionLevel('invalid')).toBe('eighths');
	});

	test('parses difficulty and tempo within supported ranges', () => {
		expect(parseDifficulty('3')).toBe(3);
		expect(parseDifficulty('9')).toBe(2);
		expect(parseStoredTempo('140')).toBe(140);
		expect(parseStoredTempo('999')).toBe(BPM_DEFAULT);
	});
});

describe('explicit-true mute preferences', () => {
	afterEach(() => {
		memoryStore.clear();
	});

	test('reads false when nothing is stored', () => {
		expect(readMuteMetronome()).toBe(false);
		expect(parseExplicitTrue(null)).toBe(false);
	});

	test('persists muted as true and clears on unmute', () => {
		writeMuteMetronome(true);
		expect(localStorage.getItem(MUTE_METRONOME_STORAGE_KEY)).toBe('true');
		expect(readMuteMetronome()).toBe(true);

		writeMuteMetronome(false);
		expect(localStorage.getItem(MUTE_METRONOME_STORAGE_KEY)).toBeNull();
		expect(readMuteMetronome()).toBe(false);
	});

	test('ignores non-true stored values', () => {
		localStorage.setItem(MUTE_RHYTHM_STORAGE_KEY, 'yes');
		expect(parseExplicitTrue('yes')).toBe(false);
	});
});

describe('count-in preference', () => {
	afterEach(() => {
		memoryStore.clear();
	});

	test('enables count-in by default', () => {
		expect(readCountInEnabled()).toBe(true);
	});

	test('persists disabled count-in and clears on enable', () => {
		writeCountInEnabled(false);
		expect(localStorage.getItem(COUNT_IN_ENABLED_STORAGE_KEY)).toBe('false');
		expect(readCountInEnabled()).toBe(false);

		writeCountInEnabled(true);
		expect(localStorage.getItem(COUNT_IN_ENABLED_STORAGE_KEY)).toBeNull();
		expect(readCountInEnabled()).toBe(true);
	});

	test('migrates legacy count-in mute preference', () => {
		localStorage.setItem(LEGACY_STORAGE_KEYS.muteCountIn, 'true');
		expect(readCountInEnabled()).toBe(false);
		expect(parseCountInEnabledStored('invalid')).toBe(false);

		writeCountInEnabled(true);
		expect(localStorage.getItem(LEGACY_STORAGE_KEYS.muteCountIn)).toBeNull();
		expect(readCountInEnabled()).toBe(true);
	});
});

describe('difficulty and tempo persistence', () => {
	afterEach(() => {
		memoryStore.clear();
		resetPreferenceBootstrapForTests();
	});

	test('persists difficulty and omits default value', () => {
		writeDifficulty(4);
		expect(localStorage.getItem(STORAGE_KEYS.difficulty)).toBe('4');
		expect(readDifficulty()).toBe(4);

		writeDifficulty(2);
		expect(localStorage.getItem(STORAGE_KEYS.difficulty)).toBeNull();
		expect(readDifficulty()).toBe(2);
	});

	test('persists tempo values', () => {
		writeStoredTempo(132);
		expect(localStorage.getItem(STORAGE_KEYS.tempo)).toBe('132');
		expect(readStoredTempo()).toBe(132);
	});

	test('stores non-default theme preference only', () => {
		writeThemeSetting('dark');
		expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark');

		writeThemeSetting(null);
		expect(localStorage.getItem(STORAGE_KEYS.theme)).toBeNull();
	});
});

describe('tempo URL bootstrap', () => {
	afterEach(() => {
		memoryStore.clear();
		resetPreferenceBootstrapForTests();
	});

	test('resolveInitialTempo uses ?bpm= once and strips it from the URL', () => {
		const replaceStateCalls: unknown[][] = [];
		Object.defineProperty(globalThis, 'history', {
			value: {
				state: null,
				replaceState: (...args: unknown[]) => {
					replaceStateCalls.push(args);
				},
			},
			configurable: true,
		});

		Object.defineProperty(globalThis, 'location', {
			value: new URL('https://example.test/?bpm=140&foo=bar'),
			configurable: true,
		});

		expect(resolveInitialTempo()).toBe(140);
		expect(readStoredTempo()).toBe(140);
		expect(replaceStateCalls.at(-1)?.[2]).toBe('/?foo=bar');

		memoryStore.set(STORAGE_KEYS.tempo, '150');
		expect(resolveInitialTempo()).toBe(140);
	});
});
