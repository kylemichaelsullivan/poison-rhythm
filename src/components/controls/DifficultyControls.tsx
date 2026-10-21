import { useDisclosure } from '@/hooks/useDisclosure';
import { DifficultyFramedBlock } from './DifficultyFramedBlock';
import { DifficultyHelpModal } from './DifficultyHelpModal';
import { DifficultySettingsBlock } from './DifficultySettingsBlock';
import { PlayModesModal } from './PlayModesModal';

type DifficultyControlsProps = {
	/**
	 * When true (default), render the bordered Difficulty section with play-mode
	 * badge (About modal). When false, compact Settings-friendly block without badge.
	 */
	framed?: boolean;
};

/**
 * Difficulty section composer. Slider / play-mode bind globally; help and
 * Play Modes modals stay local disclosure.
 */
export function DifficultyControls({ framed = true }: DifficultyControlsProps) {
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

	function openPlayModes() {
		setHelpOpen(false);
		setModesOpen(true);
	}

	return (
		<>
			{framed ? (
				<DifficultyFramedBlock
					onOpenHelp={onOpenHelp}
					onOpenPlayModes={onOpenModes}
				/>
			) : (
				<DifficultySettingsBlock onOpenHelp={onOpenHelp} />
			)}

			<DifficultyHelpModal
				open={helpOpen}
				onClose={onCloseHelp}
				onOpenPlayModes={openPlayModes}
			/>

			<PlayModesModal open={modesOpen} onClose={onCloseModes} />
		</>
	);
}
