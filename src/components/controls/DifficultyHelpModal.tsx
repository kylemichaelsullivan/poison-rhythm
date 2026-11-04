import { Modal } from '@/components/layout';
import { Button, Caption, Row, Stack } from '@/components/ui';
import { DifficultyHelpList } from './DifficultyHelpList';

type DifficultyHelpModalProps = {
	open: boolean;
	onClose: () => void;
	onOpenPlayModes: () => void;
};

export function DifficultyHelpModal({
	open,
	onClose,
	onOpenPlayModes,
}: DifficultyHelpModalProps) {
	return (
		<Modal open={open} title='Difficulty Levels' onClose={onClose}>
			<Stack gap='3'>
				<DifficultyHelpList />
				<Caption size='sm'>
					Ranges are for 1/16 grids; on 1/8 or 1/4 they shrink so higher levels
					stay varied instead of filling every beat.
				</Caption>
				<Row justify='center'>
					<Button
						variant='secondary'
						title='Open Play Modes'
						onClick={onOpenPlayModes}
					>
						Play Modes
					</Button>
				</Row>
			</Stack>
		</Modal>
	);
}
