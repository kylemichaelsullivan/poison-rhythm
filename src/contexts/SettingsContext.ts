import { createContext, useContext } from 'react';
import type { GameSettings } from '@/lib/settings-schema';

export type SettingsContextValue = {
	settings: GameSettings;
	setSettings: (settings: GameSettings) => void;
	updateSettings: (partial: Partial<GameSettings>) => void;
	resetSettings: () => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within SettingsProvider');
	}
	return context;
}
