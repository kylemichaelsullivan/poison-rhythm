import { Modal } from '@/components/layout';
import { DisplayModeControls } from '@/components/layout/settings/DisplayModeControls';

type DisplayModeModalProps = {
	open: boolean;
	onClose: () => void;
};

export function DisplayModeModal({ open, onClose }: DisplayModeModalProps) {
	return (
		<Modal open={open} title='Display Mode' onClose={onClose}>
			<DisplayModeControls />
		</Modal>
	);
}
