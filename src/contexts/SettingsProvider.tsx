import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { SettingsContext } from '@/contexts/SettingsContext';
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

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettingsState] = useLocalStorage({
		key: STORAGE_KEYS.gameSettings,
		parse: parseGameSettings,
		serialize: serializeGameSettings,
		getDefault: getDefaultGameSettings,
	});

	const setSettings = useCallback(
		(next: GameSettings) => {
			setSettingsState(sanitizeGameSettings(next));
		},
		[setSettingsState],
	);

	const updateSettings = useCallback(
		(partial: Partial<GameSettings>) => {
			setSettingsState(sanitizeGameSettings({ ...settings, ...partial }));
		},
		[setSettingsState, settings],
	);

	const resetSettings = useCallback(() => {
		setSettingsState(DEFAULT_SETTINGS);
	}, [setSettingsState]);

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
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}
