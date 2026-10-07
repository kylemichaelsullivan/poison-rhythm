import { usePendingDifficulty, useSettings } from '@/contexts';
import { useDisclosure } from '@/hooks/useDisclosure';
import {
	type GameMode,
	type GameModeHudBadge,
	gameModeHudBadge,
} from '@/lib/settings-schema';
import { DifficultyFramedBlock } from './DifficultyFramedBlock';
import { DifficultyHelpModal } from './DifficultyHelpModal';
import { DifficultySettingsBlock } from './DifficultySettingsBlock';
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
	const {
		open: helpOpen,
		onOpen: onOpenHelp,
		onClose: onCloseHelp,
		setOpen: setHelpOpen,
	} = useDisclosure();
	const {
		open: modesOpen,
		onOpen: onOpenModes,
		onClose: onCloseModes,
		setOpen: setModesOpen,
	} = useDisclosure();

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

	return (
		<>
			{framed ? (
				<DifficultyFramedBlock
					sliderValue={sliderValue}
					onDifficultyChange={onDifficultyChange}
					modeBadge={modeBadge}
					onOpenHelp={onOpenHelp}
					onOpenPlayModes={onOpenModes}
				/>
			) : (
				<DifficultySettingsBlock
					sliderValue={sliderValue}
					onDifficultyChange={onDifficultyChange}
					onOpenHelp={onOpenHelp}
				/>
			)}

			<DifficultyHelpModal
				open={helpOpen}
				onClose={onCloseHelp}
				onOpenPlayModes={openPlayModes}
			/>

			<PlayModesModal
				open={modesOpen}
				selectedMode={settings.gameMode}
				endless={settings.endless}
				onClose={onCloseModes}
				onSelectMode={onSelectMode}
				onEndlessChange={onEndlessChange}
			/>
		</>
	);
}
