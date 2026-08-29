import { Modal } from '@/components/layout';
import { Button, Caption, Stack } from '@/components/ui';
import { ModalActions } from './ModalActions';

type ConfirmRegenModalProps = {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
};

export function ConfirmRegenModal({
	open,
	onCancel,
	onConfirm,
}: ConfirmRegenModalProps) {
	return (
		<Modal open={open} title='Difficulty Changed' onClose={onCancel}>
			<Stack gap='4'>
				<Caption size='sm'>
					Difficulty changed. Regenerate pattern to apply new settings?
				</Caption>
				<ModalActions>
					<Button variant='secondary' onClick={onCancel}>
						Cancel
					</Button>
					<Button variant='primary' modalInitialFocus onClick={onConfirm}>
						Regenerate
					</Button>
				</ModalActions>
			</Stack>
		</Modal>
	);
}
