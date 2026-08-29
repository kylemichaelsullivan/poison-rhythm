import { beforeEach, describe, expect, test } from 'bun:test';
import { DEFAULT_SETTINGS, parseGameSettings } from '@/lib/settings-schema';
import {
	readStorageItem,
	removeStorageItem,
	writeStorageItem,
} from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/storage-keys';

describe('parseGameSettings snapshot stability', () => {
	beforeEach(() => {
		removeStorageItem(STORAGE_KEYS.gameSettings);
	});

	test('returns stable DEFAULT_SETTINGS reference when storage is empty', () => {
		const a = parseGameSettings(null);
		const b = parseGameSettings(null);
		expect(a).toBe(DEFAULT_SETTINGS);
		expect(b).toBe(DEFAULT_SETTINGS);
	});

	test('stored settings parse consistently for same raw value', () => {
		writeStorageItem(
			STORAGE_KEYS.gameSettings,
			JSON.stringify(DEFAULT_SETTINGS),
		);
		const raw = readStorageItem(STORAGE_KEYS.gameSettings);
		const a = parseGameSettings(raw);
		const b = parseGameSettings(raw);
		expect(a).toEqual(b);
		expect(a.gameMode).toBe('default');
	});
});
