import { useDisclosure } from '@/hooks/useDisclosure';
import { DifficultyFramedBlock } from './DifficultyFramedBlock';
import { DifficultyHelpModal } from './DifficultyHelpModal';
import { DifficultySettingsBlock } from './DifficultySettingsBlock';

type DifficultyControlsProps = {
	/**
	 * When true (default), render the bordered Difficulty section (About modal).
	 * When false, compact Settings-friendly block.
	 */
	framed?: boolean;
};

/**
 * Difficulty section composer. Slider binds globally; help modal stays local.
 * Play mode lives in `PlayModeControls` (About / Settings → Mode).
 */
export function DifficultyControls({ framed = true }: DifficultyControlsProps) {
	const {
		open: helpOpen,
		onOpen: onOpenHelp,
		onClose: onCloseHelp,
	} = useDisclosure();

	return (
		<>
			{framed ? (
				<DifficultyFramedBlock onOpenHelp={onOpenHelp} />
			) : (
				<DifficultySettingsBlock onOpenHelp={onOpenHelp} />
			)}

			<DifficultyHelpModal open={helpOpen} onClose={onCloseHelp} />
		</>
	);
}
