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
			<Stack gap='4'>
				<DifficultyHelpList />
				<Caption size='sm'>
					On 1/8 or 1/4 notes, hit counts shrink to fit the fewer slots so
					higher difficulty stays varied instead of filling every beat.
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
