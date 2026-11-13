import { createContext, useContext } from 'react';
import type { GameSettings } from '@/lib/settings-schema';

export type SettingsContextValue = {
	settings: GameSettings;
	setSettings: (settings: GameSettings) => void;
	updateSettings: (partial: Partial<GameSettings>) => void;
	resetSettings: () => void;
};

/**
 * Stable store API for per-key subscriptions. Identity does not change when
 * settings values change — only `getSettings()` / listeners do.
 */
export type SettingsStoreApi = {
	getSettings: () => GameSettings;
	subscribe: (onStoreChange: () => void) => () => void;
	subscribeKey: (
		key: keyof GameSettings,
		onStoreChange: () => void,
	) => () => void;
	setSettings: (settings: GameSettings) => void;
	updateSettings: (partial: Partial<GameSettings>) => void;
	resetSettings: () => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsStoreContext = createContext<SettingsStoreApi | null>(
	null,
);

/** Full settings blob — re-renders on any key change. */
export function useSettings(): SettingsContextValue {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within SettingsProvider');
	}
	return context;
}

export function useSettingsStore(): SettingsStoreApi {
	const store = useContext(SettingsStoreContext);
	if (!store) {
		throw new Error('useSettingsStore must be used within SettingsProvider');
	}
	return store;
}
