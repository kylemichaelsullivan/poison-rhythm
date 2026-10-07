import { usePendingDifficulty } from '@/contexts';
import { DifficultyRegenAckModal } from './DifficultyRegenAckModal';

/** App-level host for the post-difficulty-regen acknowledgement modal. */
export function DifficultyRegenAckHost() {
	const { ackOpen, onAcknowledgeRegen } = usePendingDifficulty();

	return (
		<DifficultyRegenAckModal
			open={ackOpen}
			onAcknowledge={onAcknowledgeRegen}
		/>
	);
}
