import { useCallback } from 'react';
import { useColorPreferences, useTheme } from '@/contexts';
import { useColorRoleSelection } from '@/hooks/useColorRoleSelection';
import { usePaletteContrast } from '@/hooks/usePaletteContrast';
import type { ColorPairing, CrayonId } from '@/lib/colors';
import { nextThemePreference, themeOptionFor } from '@/lib/theme-options';
import { SettingsGroup } from '../SettingsGroup';
import { ColorPairPreview } from './ColorPairPreview';
import { ContrastScoreMeter } from './ContrastScoreMeter';
import { CrayonTray } from './CrayonTray';
import { SuggestedPairings } from './SuggestedPairings';

/**
 * Settings → Colors composer. Owns palette prefs + theme; children are
 * prop-driven. Edit-role selection is local. CrayonTray is memoized so theme
 * taps do not rescore all 64 crayons.
 */
export function ColorAccentSettings() {
	const {
		dominantColor,
		secondaryColor,
		setDominantColor,
		setSecondaryColor,
		swapColors,
	} = useColorPreferences();
	const { theme, setTheme } = useTheme();
	const roleSelection = useColorRoleSelection(dominantColor, secondaryColor);
	const scores = usePaletteContrast(dominantColor, secondaryColor);
	const themeCaption = themeOptionFor(theme).label;

	const handleApplyPairing = useCallback(
		(pairing: ColorPairing) => {
			setDominantColor(pairing.dominantId);
			setSecondaryColor(pairing.secondaryId);
		},
		[setDominantColor, setSecondaryColor],
	);

	const handleSelectCrayon = useCallback(
		(id: CrayonId) => {
			if (roleSelection.role === 'dominant') {
				setDominantColor(id);
			} else {
				setSecondaryColor(id);
			}
		},
		[roleSelection.role, setDominantColor, setSecondaryColor],
	);

	const handleThemeModeSelect = useCallback(
		(mode: 'light' | 'dark') => {
			setTheme(nextThemePreference(theme, mode));
		},
		[setTheme, theme],
	);

	return (
		<>
			<SettingsGroup title='Colors'>
				<ColorPairPreview
					role={roleSelection.role}
					onRoleChange={roleSelection.setRole}
					dominantColor={dominantColor}
					secondaryColor={secondaryColor}
					onSwap={swapColors}
				/>
				<ContrastScoreMeter
					light={scores.light}
					dark={scores.dark}
					theme={theme}
					onThemeModeSelect={handleThemeModeSelect}
					themeCaption={themeCaption}
				/>
				<CrayonTray
					role={roleSelection.role}
					activeId={roleSelection.activeId}
					partnerId={roleSelection.partnerId}
					partnerHex={roleSelection.partnerHex}
					roleLabel={roleSelection.roleLabel}
					partnerRoleLabel={roleSelection.partnerRoleLabel}
					onSelect={handleSelectCrayon}
				/>
			</SettingsGroup>

			<SettingsGroup title='Suggested Pairings'>
				<SuggestedPairings
					dominantColor={dominantColor}
					secondaryColor={secondaryColor}
					onApply={handleApplyPairing}
				/>
			</SettingsGroup>
		</>
	);
}
