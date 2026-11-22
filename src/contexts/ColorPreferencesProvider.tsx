import { useCallback, useEffect, useMemo } from 'react';
import { ColorPreferencesContext } from '@/contexts/ColorPreferencesContext';
import { useActiveProfileId } from '@/contexts/ProfilesContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { applyColorPreferenceVars, swapAccentColors } from '@/lib/colors';
import {
	parseColorPreference,
	serializeColorPreference,
} from '@/lib/preference-schemas';
import { preferenceStorageKey } from '@/lib/storage-keys';
import type { ReactNode } from 'react';
import type { ColorPreference } from '@/lib/preference-schemas';

export function ColorPreferencesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const profileId = useActiveProfileId();
	const [dominantColor, setDominantColorState] = useLocalStorage({
		key: preferenceStorageKey('dominantColor', profileId),
		parse: parseColorPreference,
		serialize: serializeColorPreference,
		getDefault: () => null,
	});

	const [secondaryColor, setSecondaryColorState] = useLocalStorage({
		key: preferenceStorageKey('secondaryColor', profileId),
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

	const swapColors = useCallback(() => {
		const next = swapAccentColors(dominantColor, secondaryColor);
		setDominantColorState(next.dominantId);
		setSecondaryColorState(next.secondaryId);
	}, [
		dominantColor,
		secondaryColor,
		setDominantColorState,
		setSecondaryColorState,
	]);

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
			swapColors,
			resetToBrand,
			isBrandDefault: dominantColor === null && secondaryColor === null,
		}),
		[
			dominantColor,
			secondaryColor,
			setDominantColor,
			setSecondaryColor,
			swapColors,
			resetToBrand,
		],
	);

	return (
		<ColorPreferencesContext.Provider value={value}>
			{children}
		</ColorPreferencesContext.Provider>
	);
}
