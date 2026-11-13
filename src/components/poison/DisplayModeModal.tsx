import { ContentModal } from '@/components/layout/ContentModal';
import { DisplayModeControls } from '@/components/layout/settings/DisplayModeControls';

type DisplayModeModalProps = {
	open: boolean;
	onClose: () => void;
};

export function DisplayModeModal({ open, onClose }: DisplayModeModalProps) {
	return (
		<ContentModal open={open} title='Display Mode' onClose={onClose}>
			<DisplayModeControls />
		</ContentModal>
	);
}
