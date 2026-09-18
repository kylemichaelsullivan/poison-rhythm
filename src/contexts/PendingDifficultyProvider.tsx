import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmRegenModal } from '@/components/controls/ConfirmRegenModal';
import { useGame } from '@/contexts/GameContext';
import {
	PendingDifficultyContext,
	type PendingDifficultyContextValue,
} from '@/contexts/PendingDifficultyContext';
import { useDifficulty } from '@/contexts/PreferencesContext';

export function PendingDifficultyProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { difficulty, setDifficulty } = useDifficulty();
	const { round, handleNewRound } = useGame();
	const [draftDifficulty, setDraftDifficulty] = useState<number | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const sliderValue = draftDifficulty ?? difficulty;

	const onDifficultyChange = useCallback(
		(next: number) => {
			if (next === difficulty) {
				setDraftDifficulty(null);
				return;
			}
			if (round) {
				setDraftDifficulty(next);
				return;
			}
			setDraftDifficulty(null);
			setDifficulty(next);
		},
		[difficulty, round, setDifficulty],
	);

	const onHostModalClosed = useCallback(() => {
		if (draftDifficulty === null || draftDifficulty === difficulty) {
			setDraftDifficulty(null);
			return;
		}
		if (!round) {
			setDifficulty(draftDifficulty);
			setDraftDifficulty(null);
			return;
		}
		setConfirmOpen(true);
	}, [draftDifficulty, difficulty, round, setDifficulty]);

	const onCancelRegen = useCallback(() => {
		setConfirmOpen(false);
		setDraftDifficulty(null);
	}, []);

	const onConfirmRegen = useCallback(() => {
		if (draftDifficulty === null) {
			setConfirmOpen(false);
			return;
		}
		const next = draftDifficulty;
		setConfirmOpen(false);
		setDraftDifficulty(null);
		setDifficulty(next);
		handleNewRound({ difficulty: next });
	}, [draftDifficulty, setDifficulty, handleNewRound]);

	const value = useMemo(
		(): PendingDifficultyContextValue => ({
			sliderValue,
			onDifficultyChange,
			onHostModalClosed,
		}),
		[sliderValue, onDifficultyChange, onHostModalClosed],
	);

	return (
		<PendingDifficultyContext.Provider value={value}>
			{children}
			<ConfirmRegenModal
				open={confirmOpen}
				onCancel={onCancelRegen}
				onConfirm={onConfirmRegen}
			/>
		</PendingDifficultyContext.Provider>
	);
}
