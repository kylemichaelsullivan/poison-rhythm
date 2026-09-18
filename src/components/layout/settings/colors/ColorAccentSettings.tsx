import { useMemo, useState } from 'react';
import { useColorPreferences } from '@/contexts';
import {
	assessCrayonContrast,
	type ColorPairing,
	type ColorRole,
	type CrayonId,
	crayonByIdOrNull,
	suggestPairings,
} from '@/lib/colors';
import { SettingsGroup } from '../SettingsGroup';
import { ColorPairPreview } from './ColorPairPreview';
import { ContrastWarningModal } from './ContrastWarningModal';
import { CrayonTray } from './CrayonTray';
import { SuggestedPairings } from './SuggestedPairings';

type PendingContrastPick = {
	id: CrayonId;
	name: string;
	summary: string;
};

/** Color groups for Settings → Look (preview → tray → pairings). */
export function ColorAccentSettings() {
	const { dominantColor, secondaryColor, setDominantColor, setSecondaryColor } =
		useColorPreferences();
	const [role, setRole] = useState<ColorRole>('dominant');
	const [pendingPick, setPendingPick] = useState<PendingContrastPick | null>(
		null,
	);
	const pairings = useMemo(() => suggestPairings(), []);

	const selectedId = role === 'dominant' ? dominantColor : secondaryColor;

	const applyColor = (id: CrayonId) => {
		if (role === 'dominant') {
			setDominantColor(id);
		} else {
			setSecondaryColor(id);
		}
	};

	const handleSelect = (id: CrayonId) => {
		if (id === selectedId) {
			return;
		}
		const crayon = crayonByIdOrNull(id);
		if (crayon == null) {
			return;
		}
		const assessment = assessCrayonContrast(crayon.hex, role);
		if (assessment.level === 'warn') {
			setPendingPick({
				id,
				name: crayon.name,
				summary: assessment.summary ?? 'This color has low contrast.',
			});
			return;
		}
		applyColor(id);
	};

	const handleApplyPairing = (pairing: ColorPairing) => {
		setDominantColor(pairing.dominantId);
		setSecondaryColor(pairing.secondaryId);
	};

	const handleConfirmLowContrast = () => {
		if (pendingPick == null) {
			return;
		}
		applyColor(pendingPick.id);
		setPendingPick(null);
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
				<CrayonTray
					role={role}
					selectedId={selectedId}
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

			<ContrastWarningModal
				open={pendingPick != null}
				crayonName={pendingPick?.name ?? ''}
				summary={pendingPick?.summary ?? ''}
				onCancel={() => setPendingPick(null)}
				onConfirm={handleConfirmLowContrast}
			/>
		</>
	);
}
