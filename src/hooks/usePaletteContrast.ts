import { useMemo } from 'react';
import {
	ratePaletteThemes,
	resolveDominantHex,
	resolveSecondaryHex,
} from '@/lib/colors';
import type { ThemeContrastScores } from '@/lib/colors';
import type { ColorPreference } from '@/lib/preference-schemas';

/** Memoized Light/Dark pair grades for the current Dominant/Secondary prefs. */
export function usePaletteContrast(
	dominantColor: ColorPreference,
	secondaryColor: ColorPreference,
): ThemeContrastScores {
	return useMemo(
		() =>
			ratePaletteThemes(
				resolveDominantHex(dominantColor),
				resolveSecondaryHex(secondaryColor),
			),
		[dominantColor, secondaryColor],
	);
}
