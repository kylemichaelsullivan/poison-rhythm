import { useState } from 'react';
import { Section } from '@/components/layout';
import { useSettings } from '@/contexts';
import { usePendingDifficulty } from '@/hooks/usePendingDifficulty';
import {
	type GameMode,
	type GameModeHudBadge,
	gameModeHudBadge,
} from '@/lib/settings-schema';
import { ConfirmRegenModal } from './ConfirmRegenModal';
import { DifficultyHelpModal } from './DifficultyHelpModal';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';
import { ModeBadgeTrigger } from './ModeBadgeTrigger';
import { PlayModesModal } from './PlayModesModal';

const POISON_BADGE: GameModeHudBadge = {
	label: 'POISON',
	tone: 'classic',
};

export function GameControls() {
	const { settings, updateSettings } = useSettings();
	const {
		sliderValue,
		pendingDifficulty,
		onDifficultyChange,
		onCancelRegen,
		onConfirmRegen,
	} = usePendingDifficulty();
	const [helpOpen, setHelpOpen] = useState(false);
	const [modesOpen, setModesOpen] = useState(false);

	const modeBadge = gameModeHudBadge(settings) ?? POISON_BADGE;

	function onSelectMode(value: GameMode) {
		updateSettings({ gameMode: value });
	}

	function onEndlessChange(enabled: boolean) {
		updateSettings({ endless: enabled });
	}

	return (
		<>
			<Section
				title='Difficulty'
				headerLeading={<InfoGlyphButton onClick={() => setHelpOpen(true)} />}
				headerAction={
					<ModeBadgeTrigger
						badge={modeBadge}
						onClick={() => setModesOpen(true)}
					/>
				}
			>
				<DifficultySlider value={sliderValue} onChange={onDifficultyChange} />
			</Section>

			<PlayModesModal
				open={modesOpen}
				selectedMode={settings.gameMode}
				endless={settings.endless}
				onClose={() => setModesOpen(false)}
				onSelectMode={onSelectMode}
				onEndlessChange={onEndlessChange}
			/>

			<DifficultyHelpModal
				open={helpOpen}
				onClose={() => setHelpOpen(false)}
				onOpenPlayModes={() => {
					setHelpOpen(false);
					setModesOpen(true);
				}}
			/>

			<ConfirmRegenModal
				open={pendingDifficulty !== null}
				onCancel={onCancelRegen}
				onConfirm={onConfirmRegen}
			/>
		</>
	);
}
