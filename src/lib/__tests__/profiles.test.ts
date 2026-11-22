import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { resetPreferenceBootstrapForTests } from '../preference-storage';
import {
	createDefaultRegistry,
	ensureProfilesRegistry,
	normalizeProfilesRegistry,
	parseProfilesRegistry,
	readProfilesRegistry,
	reorderProfileList,
} from '../profiles';
import {
	DEFAULT_PROFILE_ID,
	DEFAULT_PROFILE_NAME,
	DEVICE_STORAGE_KEYS,
	FLAT_PROFILE_STORAGE_KEYS,
	preferenceStorageKey,
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

describe('profiles registry', () => {
	afterEach(() => {
		memoryStore.clear();
		resetPreferenceBootstrapForTests();
	});

	test('createDefaultRegistry uses the stable default id', () => {
		const registry = createDefaultRegistry(1_700_000_000_000);
		expect(registry.activeProfileId).toBe(DEFAULT_PROFILE_ID);
		expect(registry.profiles).toHaveLength(1);
		expect(registry.profiles[0]?.name).toBe(DEFAULT_PROFILE_NAME);
	});

	test('ensureProfilesRegistry migrates flat preference keys', () => {
		localStorage.setItem(FLAT_PROFILE_STORAGE_KEYS.tempo, '144');
		localStorage.setItem(FLAT_PROFILE_STORAGE_KEYS.theme, 'dark');

		const registry = ensureProfilesRegistry();
		expect(registry.activeProfileId).toBe(DEFAULT_PROFILE_ID);
		expect(localStorage.getItem(DEVICE_STORAGE_KEYS.profiles)).not.toBeNull();
		expect(
			localStorage.getItem(preferenceStorageKey('tempo', DEFAULT_PROFILE_ID)),
		).toBe('144');
		expect(
			localStorage.getItem(preferenceStorageKey('theme', DEFAULT_PROFILE_ID)),
		).toBe('dark');
		expect(localStorage.getItem(FLAT_PROFILE_STORAGE_KEYS.tempo)).toBeNull();
		expect(localStorage.getItem(FLAT_PROFILE_STORAGE_KEYS.theme)).toBeNull();
	});

	test('ensureProfilesRegistry is idempotent once written', () => {
		const first = ensureProfilesRegistry();
		localStorage.setItem(
			preferenceStorageKey('tempo', DEFAULT_PROFILE_ID),
			'160',
		);
		const second = ensureProfilesRegistry();
		expect(second).toEqual(first);
		expect(
			localStorage.getItem(preferenceStorageKey('tempo', DEFAULT_PROFILE_ID)),
		).toBe('160');
	});

	test('parseProfilesRegistry rejects missing active profile', () => {
		expect(
			parseProfilesRegistry(
				JSON.stringify({
					activeProfileId: 'missing',
					profiles: [{ id: 'a', name: 'A', createdAt: 1 }],
				}),
			),
		).toBeNull();
		expect(readProfilesRegistry()).toBeNull();
	});

	test('normalizeProfilesRegistry renames legacy Player 1 default', () => {
		const normalized = normalizeProfilesRegistry({
			activeProfileId: DEFAULT_PROFILE_ID,
			profiles: [
				{ id: DEFAULT_PROFILE_ID, name: 'Player 1', createdAt: 1 },
				{ id: 'other', name: 'Alex', createdAt: 2 },
			],
		});
		expect(normalized.profiles[0]?.name).toBe(DEFAULT_PROFILE_NAME);
		expect(normalized.profiles[1]?.name).toBe('Alex');
	});

	test('reorderProfileList moves an item to a new index', () => {
		const profiles = [
			{ id: 'a', name: 'A', createdAt: 1 },
			{ id: 'b', name: 'B', createdAt: 2 },
			{ id: 'c', name: 'C', createdAt: 3 },
		];
		expect(reorderProfileList(profiles, 0, 2).map((p) => p.id)).toEqual([
			'b',
			'c',
			'a',
		]);
		expect(reorderProfileList(profiles, 2, 0).map((p) => p.id)).toEqual([
			'c',
			'a',
			'b',
		]);
		expect(reorderProfileList(profiles, 1, 1)).toBe(profiles);
	});
});
