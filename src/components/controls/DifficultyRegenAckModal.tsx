import { Modal } from '@/components/layout';
import { Button, Caption, Stack } from '@/components/ui';
import { ModalActions } from './ModalActions';

type DifficultyRegenAckModalProps = {
	open: boolean;
	onAcknowledge: () => void;
};

export function DifficultyRegenAckModal({
	open,
	onAcknowledge,
}: DifficultyRegenAckModalProps) {
	return (
		<Modal open={open} title='Difficulty Updated' onClose={onAcknowledge}>
			<Stack gap='4'>
				<Caption size='sm'>
					Difficulty updated. A new pattern was generated.
				</Caption>
				<ModalActions>
					<Button variant='primary' modalInitialFocus onClick={onAcknowledge}>
						OK
					</Button>
				</ModalActions>
			</Stack>
		</Modal>
	);
}
