import { useState } from 'react';
import { useDifficulty, useGame } from '@/contexts';

type UsePendingDifficultyResult = {
	sliderValue: number;
	pendingDifficulty: number | null;
	onDifficultyChange: (next: number) => void;
	onCancelRegen: () => void;
	onConfirmRegen: () => void;
};

export function usePendingDifficulty(): UsePendingDifficultyResult {
	const { difficulty, setDifficulty } = useDifficulty();
	const { round, handleNewRound } = useGame();
	const [pendingDifficulty, setPendingDifficulty] = useState<number | null>(
		null,
	);

	const sliderValue = pendingDifficulty ?? difficulty;

	function onDifficultyChange(next: number) {
		if (round && next !== difficulty) {
			setPendingDifficulty(next);
			return;
		}
		setDifficulty(next);
	}

	function onCancelRegen() {
		setPendingDifficulty(null);
	}

	function onConfirmRegen() {
		if (pendingDifficulty === null) {
			return;
		}
		const next = pendingDifficulty;
		setPendingDifficulty(null);
		setDifficulty(next);
		handleNewRound({ difficulty: next });
	}

	return {
		sliderValue,
		pendingDifficulty,
		onDifficultyChange,
		onCancelRegen,
		onConfirmRegen,
	};
}
