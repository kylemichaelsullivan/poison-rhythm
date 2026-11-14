import { createContext, useContext } from 'react';
import type { VisualHint } from '@/lib/game-modes';
import type { GameMode } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure, Round } from '@/types';

export type NewRoundOverrides = {
	difficulty?: number;
	/** Apply before create when mode just changed (settings may still be stale). */
	gameMode?: GameMode;
};

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
	/** Classic-only: full-screen overlay after the poison measure plays. */
	poisonHitOpen: boolean;
	acknowledgePoisonHit: () => void;
	setCurrentIndex: (index: number) => void;
	handleNewRound: (overrides?: NewRoundOverrides) => void;
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
