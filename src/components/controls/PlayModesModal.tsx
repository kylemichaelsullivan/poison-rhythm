import { ContentModal } from '@/components/layout/ContentModal';
import { PlayModeOptionList } from './PlayModeOptionList';

type PlayModesModalProps = {
	open: boolean;
	onClose: () => void;
};

/** Play Modes dialog — mode/endless bind globally inside the option list. */
export function PlayModesModal({ open, onClose }: PlayModesModalProps) {
	return (
		<ContentModal open={open} title='Play Modes' onClose={onClose}>
			<PlayModeOptionList />
		</ContentModal>
	);
}
