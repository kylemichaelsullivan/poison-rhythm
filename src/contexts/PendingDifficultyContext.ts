import { createContext, useContext } from 'react';

export type PendingDifficultyContextValue = {
	/** Value shown on the difficulty slider (draft or committed). */
	sliderValue: number;
	onDifficultyChange: (next: number) => void;
	/**
	 * Call when a host modal that contains the difficulty slider closes.
	 * Opens the regenerate confirm only if difficulty changed from the
	 * committed value while a round is active.
	 */
	onHostModalClosed: () => void;
};

export const PendingDifficultyContext =
	createContext<PendingDifficultyContextValue | null>(null);

export function usePendingDifficulty(): PendingDifficultyContextValue {
	const context = useContext(PendingDifficultyContext);
	if (context == null) {
		throw new Error(
			'usePendingDifficulty must be used within PendingDifficultyProvider',
		);
	}
	return context;
}
