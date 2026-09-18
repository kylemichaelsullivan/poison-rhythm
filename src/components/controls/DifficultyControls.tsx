import { useState } from 'react';
import { Section } from '@/components/layout';
import { SettingRow } from '@/components/layout/settings/SettingRow';
import { usePendingDifficulty, useSettings } from '@/contexts';
import {
	type GameMode,
	type GameModeHudBadge,
	gameModeHudBadge,
} from '@/lib/settings-schema';
import { DifficultyHelpModal } from './DifficultyHelpModal';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';
import { ModeBadgeTrigger } from './ModeBadgeTrigger';
import { PlayModesModal } from './PlayModesModal';

const POISON_BADGE: GameModeHudBadge = {
	label: 'POISON',
	tone: 'classic',
};

type DifficultyControlsProps = {
	/**
	 * When true (default), render the bordered Difficulty section with play-mode
	 * badge (About modal). When false, compact Settings-friendly block without badge.
	 */
	framed?: boolean;
};

export function DifficultyControls({ framed = true }: DifficultyControlsProps) {
	const { settings, updateSettings } = useSettings();
	const { sliderValue, onDifficultyChange } = usePendingDifficulty();
	const [helpOpen, setHelpOpen] = useState(false);
	const [modesOpen, setModesOpen] = useState(false);

	const modeBadge = gameModeHudBadge(settings) ?? POISON_BADGE;

	function onSelectMode(value: GameMode) {
		updateSettings({ gameMode: value });
	}

	function onEndlessChange(enabled: boolean) {
		updateSettings({ endless: enabled });
	}

	function openPlayModes() {
		setHelpOpen(false);
		setModesOpen(true);
	}

	const info = <InfoGlyphButton onClick={() => setHelpOpen(true)} />;

	return (
		<>
			{framed ? (
				<Section
					title='Difficulty'
					headerLeading={info}
					headerAction={
						<ModeBadgeTrigger
							badge={modeBadge}
							onClick={() => setModesOpen(true)}
						/>
					}
				>
					<DifficultySlider value={sliderValue} onChange={onDifficultyChange} />
				</Section>
			) : (
				<div className='DifficultyControls flex flex-col gap-2'>
					<SettingRow label='Difficulty'>
						<div className='flex items-center gap-2'>
							{info}
							<span className='tabular-nums text-sm font-bold'>
								{sliderValue}
							</span>
						</div>
					</SettingRow>
					<DifficultySlider
						value={sliderValue}
						onChange={onDifficultyChange}
						showValue={false}
					/>
				</div>
			)}

			<DifficultyHelpModal
				open={helpOpen}
				onClose={() => setHelpOpen(false)}
				onOpenPlayModes={openPlayModes}
			/>

			<PlayModesModal
				open={modesOpen}
				selectedMode={settings.gameMode}
				endless={settings.endless}
				onClose={() => setModesOpen(false)}
				onSelectMode={onSelectMode}
				onEndlessChange={onEndlessChange}
			/>
		</>
	);
}
