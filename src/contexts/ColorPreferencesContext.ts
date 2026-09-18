import { createContext, useContext } from 'react';
import type { ColorPreference } from '@/lib/preference-schemas';

export type ColorPreferencesContextValue = {
	/** null = brand default */
	dominantColor: ColorPreference;
	secondaryColor: ColorPreference;
	setDominantColor: (color: ColorPreference) => void;
	setSecondaryColor: (color: ColorPreference) => void;
	resetToBrand: () => void;
	isBrandDefault: boolean;
};

export const ColorPreferencesContext =
	createContext<ColorPreferencesContextValue | null>(null);

export function useColorPreferences() {
	const ctx = useContext(ColorPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'useColorPreferences must be used within ColorPreferencesProvider',
		);
	}

	return ctx;
}
