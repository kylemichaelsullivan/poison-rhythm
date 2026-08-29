import { createContext, useContext } from 'react';
import type { VisualHint } from '@/lib/game-modes';
import type { RhythmMeasure, RichRhythmMeasure, Round } from '@/types';

export type GameContextValue = {
	round: Round | null;
	measures: RhythmMeasure[];
	richMeasures: RichRhythmMeasure[];
	poisonRhythm: RhythmMeasure | null;
	poisonMeasure: RichRhythmMeasure | null;
	poisonIndex: number;
	currentIndex: number;
	roundNumber: number;
	visualHints: VisualHint[];
	setCurrentIndex: (index: number) => void;
	handleNewRound: (overrides?: { difficulty?: number }) => void;
	handleReuseRound: () => void;
	onMeasureComplete: (measureIndex: number) => boolean;
};

export const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error('useGame must be used within GameProvider');
	}
	return context;
}
