import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { ColorPreferencesContext } from '@/contexts/ColorPreferencesContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { applyColorPreferenceVars } from '@/lib/colors';
import {
	type ColorPreference,
	parseColorPreference,
	serializeColorPreference,
} from '@/lib/preference-schemas';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export function ColorPreferencesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [dominantColor, setDominantColorState] = useLocalStorage({
		key: STORAGE_KEYS.dominantColor,
		parse: parseColorPreference,
		serialize: serializeColorPreference,
		getDefault: () => null,
	});

	const [secondaryColor, setSecondaryColorState] = useLocalStorage({
		key: STORAGE_KEYS.secondaryColor,
		parse: parseColorPreference,
		serialize: serializeColorPreference,
		getDefault: () => null,
	});

	useEffect(() => {
		applyColorPreferenceVars({
			dominantId: dominantColor,
			secondaryId: secondaryColor,
		});
	}, [dominantColor, secondaryColor]);

	const setDominantColor = useCallback(
		(next: ColorPreference) => setDominantColorState(next),
		[setDominantColorState],
	);

	const setSecondaryColor = useCallback(
		(next: ColorPreference) => setSecondaryColorState(next),
		[setSecondaryColorState],
	);

	const resetToBrand = useCallback(() => {
		setDominantColorState(null);
		setSecondaryColorState(null);
	}, [setDominantColorState, setSecondaryColorState]);

	const value = useMemo(
		() => ({
			dominantColor,
			secondaryColor,
			setDominantColor,
			setSecondaryColor,
			resetToBrand,
			isBrandDefault: dominantColor === null && secondaryColor === null,
		}),
		[
			dominantColor,
			secondaryColor,
			setDominantColor,
			setSecondaryColor,
			resetToBrand,
		],
	);

	return (
		<ColorPreferencesContext.Provider value={value}>
			{children}
		</ColorPreferencesContext.Provider>
	);
}
