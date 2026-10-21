import { useMemo, useState } from 'react';
import {
	type ColorRole,
	resolveDominantHex,
	resolveSecondaryHex,
} from '@/lib/colors';
import type { ColorPreference } from '@/lib/preference-schemas';

export type ColorRoleSelection = {
	role: ColorRole;
	setRole: (role: ColorRole) => void;
	activeId: ColorPreference;
	partnerId: ColorPreference;
	partnerHex: string;
	roleLabel: string;
	partnerRoleLabel: string;
};

/**
 * Local edit-role selection for Settings → Colors, derived against current prefs.
 */
export function useColorRoleSelection(
	dominantColor: ColorPreference,
	secondaryColor: ColorPreference,
): ColorRoleSelection {
	const [role, setRole] = useState<ColorRole>('dominant');

	return useMemo(() => {
		const isDominant = role === 'dominant';
		return {
			role,
			setRole,
			activeId: isDominant ? dominantColor : secondaryColor,
			partnerId: isDominant ? secondaryColor : dominantColor,
			partnerHex: isDominant
				? resolveSecondaryHex(secondaryColor)
				: resolveDominantHex(dominantColor),
			roleLabel: isDominant ? 'Dominant' : 'Secondary',
			partnerRoleLabel: isDominant ? 'Secondary' : 'Dominant',
		};
	}, [role, dominantColor, secondaryColor]);
}
