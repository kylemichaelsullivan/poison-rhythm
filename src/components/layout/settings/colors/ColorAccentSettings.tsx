import { useMemo, useState } from 'react';
import { useColorPreferences } from '@/contexts';
import {
	type ColorPairing,
	type ColorRole,
	type CrayonId,
	rateColorPairContrast,
	resolveDominantHex,
	resolveSecondaryHex,
	suggestPairings,
} from '@/lib/colors';
import { SettingsGroup } from '../SettingsGroup';
import { ColorPairPreview } from './ColorPairPreview';
import { ContrastScoreMeter } from './ContrastScoreMeter';
import { CrayonTray } from './CrayonTray';
import { SuggestedPairings } from './SuggestedPairings';

/** Color groups for Settings → Look (preview → grade → tray → pairings). */
export function ColorAccentSettings() {
	const { dominantColor, secondaryColor, setDominantColor, setSecondaryColor } =
		useColorPreferences();
	const [role, setRole] = useState<ColorRole>('dominant');
	const pairings = useMemo(() => suggestPairings(), []);

	const selectedId = role === 'dominant' ? dominantColor : secondaryColor;
	const partnerHex =
		role === 'dominant'
			? resolveSecondaryHex(secondaryColor)
			: resolveDominantHex(dominantColor);

	const contrastRating = useMemo(
		() =>
			rateColorPairContrast(
				resolveDominantHex(dominantColor),
				resolveSecondaryHex(secondaryColor),
			),
		[dominantColor, secondaryColor],
	);

	const handleSelect = (id: CrayonId) => {
		if (id === selectedId) {
			return;
		}
		if (role === 'dominant') {
			setDominantColor(id);
		} else {
			setSecondaryColor(id);
		}
	};

	const handleApplyPairing = (pairing: ColorPairing) => {
		setDominantColor(pairing.dominantId);
		setSecondaryColor(pairing.secondaryId);
	};

	return (
		<>
			<SettingsGroup title='Colors'>
				<ColorPairPreview
					dominantId={dominantColor}
					secondaryId={secondaryColor}
					role={role}
					onRoleChange={setRole}
				/>
				<ContrastScoreMeter rating={contrastRating} />
				<CrayonTray
					role={role}
					selectedId={selectedId}
					partnerHex={partnerHex}
					onSelect={handleSelect}
				/>
			</SettingsGroup>

			<SettingsGroup title='Suggested Pairings'>
				<SuggestedPairings
					pairings={pairings}
					dominantId={dominantColor}
					secondaryId={secondaryColor}
					onApply={handleApplyPairing}
				/>
			</SettingsGroup>
		</>
	);
}
