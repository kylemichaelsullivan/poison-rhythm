import { ModalActions } from '@/components/controls';
import { Modal } from '@/components/layout';
import { Button, Caption, Stack } from '@/components/ui';

type PreviewMuteConfirmModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onConfirmBoth: () => void;
};

/** Confirms Preview muted while Playback stays audible, or mutes both. */
export function PreviewMuteConfirmModal({
	open,
	onClose,
	onConfirm,
	onConfirmBoth,
}: PreviewMuteConfirmModalProps) {
	return (
		<Modal open={open} title='Mute Preview Only?' onClose={onClose}>
			<Stack gap='3'>
				<Caption size='sm'>
					Mute Preview keeps Playback on so students hear the Playing pass but
					not the Listening pass. Mute Both silences Playback too.
				</Caption>
				<ModalActions justify='center' fullWidth wrap>
					<Button
						grow
						variant='primary'
						title='Mute Both'
						modalInitialFocus
						onClick={onConfirmBoth}
					>
						Mute Both
					</Button>
					<Button grow title='Mute Preview' onClick={onConfirm}>
						Mute Preview
					</Button>
					<Button grow title='Cancel' onClick={onClose}>
						Cancel
					</Button>
				</ModalActions>
			</Stack>
		</Modal>
	);
}
