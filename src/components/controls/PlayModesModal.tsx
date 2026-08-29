import { Modal } from '@/components/layout';
import type { GameMode } from '@/lib/settings-schema';
import { PlayModeOptionList } from './PlayModeOptionList';

type PlayModesModalProps = {
	open: boolean;
	selectedMode: GameMode;
	endless: boolean;
	onClose: () => void;
	onSelectMode: (value: GameMode) => void;
	onEndlessChange: (enabled: boolean) => void;
};

export function PlayModesModal({
	open,
	selectedMode,
	endless,
	onClose,
	onSelectMode,
	onEndlessChange,
}: PlayModesModalProps) {
	return (
		<Modal open={open} title='Play Modes' onClose={onClose}>
			<PlayModeOptionList
				selectedMode={selectedMode}
				endless={endless}
				onSelect={onSelectMode}
				onEndlessChange={onEndlessChange}
			/>
		</Modal>
	);
}
