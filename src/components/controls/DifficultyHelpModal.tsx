import { Modal } from '@/components/layout';
import { Stack } from '@/components/ui';
import { DifficultyHelpList } from './DifficultyHelpList';
import { DifficultyHelpSubdivision } from './DifficultyHelpSubdivision';

type DifficultyHelpModalProps = {
	open: boolean;
	onClose: () => void;
};

export function DifficultyHelpModal({
	open,
	onClose,
}: DifficultyHelpModalProps) {
	return (
		<Modal open={open} title='Difficulty Levels' onClose={onClose}>
			<Stack gap='3'>
				<DifficultyHelpList />
				<DifficultyHelpSubdivision />
			</Stack>
		</Modal>
	);
}
