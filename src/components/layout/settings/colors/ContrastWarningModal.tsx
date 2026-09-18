import { ModalActions } from '@/components/controls/ModalActions';
import { Modal } from '@/components/layout';
import { Button, Caption, Stack } from '@/components/ui';

type ContrastWarningModalProps = {
	open: boolean;
	crayonName: string;
	summary: string;
	onCancel: () => void;
	onConfirm: () => void;
};

export function ContrastWarningModal({
	open,
	crayonName,
	summary,
	onCancel,
	onConfirm,
}: ContrastWarningModalProps) {
	return (
		<Modal open={open} title='Insufficient Contrast' onClose={onCancel}>
			<Stack gap='4'>
				<Caption size='sm'>
					{crayonName} may be hard to read in class. You can still use it, or
					pick a different crayon.
				</Caption>
				<Caption size='sm'>{summary}</Caption>
				<ModalActions>
					<Button variant='ghost' onClick={onCancel}>
						Cancel
					</Button>
					<Button variant='primary' modalInitialFocus onClick={onConfirm}>
						Use Anyway
					</Button>
				</ModalActions>
			</Stack>
		</Modal>
	);
}
