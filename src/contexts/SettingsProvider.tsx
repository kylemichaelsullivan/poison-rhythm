import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	SettingsContext,
	type SettingsStoreApi,
	SettingsStoreContext,
} from '@/contexts/SettingsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
	DEFAULT_SETTINGS,
	type GameSettings,
	parseGameSettings,
	sanitizeGameSettings,
	serializeGameSettings,
} from '@/lib/settings-schema';
import { STORAGE_KEYS } from '@/lib/storage-keys';

const getDefaultGameSettings = () => DEFAULT_SETTINGS;

function diffSettingsKeys(
	previous: GameSettings,
	next: GameSettings,
): (keyof GameSettings)[] {
	return (Object.keys(next) as (keyof GameSettings)[]).filter(
		(key) => previous[key] !== next[key],
	);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettingsState] = useLocalStorage({
		key: STORAGE_KEYS.gameSettings,
		parse: parseGameSettings,
		serialize: serializeGameSettings,
		getDefault: getDefaultGameSettings,
	});

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const previousSettingsRef = useRef(settings);
	const allListenersRef = useRef(new Set<() => void>());
	const keyListenersRef = useRef(
		new Map<keyof GameSettings, Set<() => void>>(),
	);

	const notify = useCallback((keys: readonly (keyof GameSettings)[]) => {
		for (const listener of allListenersRef.current) {
			listener();
		}
		for (const key of keys) {
			const keyListeners = keyListenersRef.current.get(key);
			if (!keyListeners) continue;
			for (const listener of keyListeners) {
				listener();
			}
		}
	}, []);

	useEffect(() => {
		const previous = previousSettingsRef.current;
		previousSettingsRef.current = settings;
		const keys = diffSettingsKeys(previous, settings);
		if (keys.length === 0) return;
		notify(keys);
	}, [settings, notify]);

	const getSettings = useCallback(() => settingsRef.current, []);

	const subscribe = useCallback((onStoreChange: () => void) => {
		allListenersRef.current.add(onStoreChange);
		return () => {
			allListenersRef.current.delete(onStoreChange);
		};
	}, []);

	const subscribeKey = useCallback(
		(key: keyof GameSettings, onStoreChange: () => void) => {
			let keyListeners = keyListenersRef.current.get(key);
			if (!keyListeners) {
				keyListeners = new Set();
				keyListenersRef.current.set(key, keyListeners);
			}
			keyListeners.add(onStoreChange);
			return () => {
				keyListeners?.delete(onStoreChange);
			};
		},
		[],
	);

	const setSettings = useCallback(
		(next: GameSettings) => {
			setSettingsState(sanitizeGameSettings(next));
		},
		[setSettingsState],
	);

	const updateSettings = useCallback(
		(partial: Partial<GameSettings>) => {
			setSettingsState((previous) =>
				sanitizeGameSettings({ ...previous, ...partial }),
			);
		},
		[setSettingsState],
	);

	const resetSettings = useCallback(() => {
		setSettingsState(DEFAULT_SETTINGS);
	}, [setSettingsState]);

	const storeApi = useMemo<SettingsStoreApi>(
		() => ({
			getSettings,
			subscribe,
			subscribeKey,
			setSettings,
			updateSettings,
			resetSettings,
		}),
		[
			getSettings,
			subscribe,
			subscribeKey,
			setSettings,
			updateSettings,
			resetSettings,
		],
	);

	const value = useMemo(
		() => ({
			settings,
			setSettings,
			updateSettings,
			resetSettings,
		}),
		[settings, setSettings, updateSettings, resetSettings],
	);

	return (
		<SettingsStoreContext.Provider value={storeApi}>
			<SettingsContext.Provider value={value}>
				{children}
			</SettingsContext.Provider>
		</SettingsStoreContext.Provider>
	);
}
