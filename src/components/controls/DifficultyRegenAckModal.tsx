import { Modal } from '@/components/layout';
import { Caption } from '@/components/ui';
import { TIMED_NOTICE_DURATION_MS } from '@/lib/timed-notice';

type DifficultyRegenAckModalProps = {
	open: boolean;
	onAcknowledge: () => void;
};

export function DifficultyRegenAckModal({
	open,
	onAcknowledge,
}: DifficultyRegenAckModalProps) {
	return (
		<Modal
			open={open}
			title='Difficulty Updated'
			dismissAfterMs={TIMED_NOTICE_DURATION_MS}
			onClose={onAcknowledge}
		>
			<Caption size='sm'>
				Difficulty updated. A new pattern was generated.
			</Caption>
		</Modal>
	);
}
