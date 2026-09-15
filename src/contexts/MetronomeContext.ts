import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';
import type { PlaybackPass, PlaybackSource } from '@/lib/playback-state';
import type { RhythmMeasure } from '@/types';

export type { PlaybackPass, PlaybackSource };

export type MetronomeContextValue = {
	tempo: number;
	activeSource: PlaybackSource | null;
	isRunning: boolean;
	isMetronomeRunning: boolean;
	isMeasuresRunning: boolean;
	isCountingIn: boolean;
	/** 1-based count-in beat shown on the play button; null when not counting in. */
	countInBeat: number | null;
	isMeasuresPlaying: boolean;
	isDemoPass: boolean;
	isStudentPass: boolean;
	playbackPass: PlaybackPass | null;
	isLit: boolean;
	subdivisionIndex: number;
	measureCycle: number;
	setPlaybackMeasure: (measure: RhythmMeasure | null) => void;
	/** @deprecated Preview measure is no longer used; listen pass uses the carousel measure. */
	setPreviewMeasure: (measure: RhythmMeasure | null) => void;
	toggleMetronome: () => void;
	toggleMeasures: () => void;
	startMetronome: () => void;
	stop: () => void;
	handleTempoChange: (updated: number) => void;
	setTempo: Dispatch<SetStateAction<number>>;
};

export const MetronomeContext = createContext<MetronomeContextValue | null>(
	null,
);

export function useMetronome(): MetronomeContextValue {
	const context = useContext(MetronomeContext);
	if (!context) {
		throw new Error('useMetronome must be used within MetronomeProvider');
	}
	return context;
}
