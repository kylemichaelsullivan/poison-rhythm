import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
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
	const [ackOpen, setAckOpen] = useState(false);

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
		const next = draftDifficulty;
		setDraftDifficulty(null);
		setDifficulty(next);
		handleNewRound({ difficulty: next });
		setAckOpen(true);
	}, [draftDifficulty, difficulty, round, setDifficulty, handleNewRound]);

	const onAcknowledgeRegen = useCallback(() => {
		setAckOpen(false);
	}, []);

	const value = useMemo(
		(): PendingDifficultyContextValue => ({
			sliderValue,
			onDifficultyChange,
			onHostModalClosed,
			ackOpen,
			onAcknowledgeRegen,
		}),
		[
			sliderValue,
			onDifficultyChange,
			onHostModalClosed,
			ackOpen,
			onAcknowledgeRegen,
		],
	);

	return (
		<PendingDifficultyContext.Provider value={value}>
			{children}
		</PendingDifficultyContext.Provider>
	);
}
