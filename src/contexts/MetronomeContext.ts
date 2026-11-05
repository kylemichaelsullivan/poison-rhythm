import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PlaybackPass, PlaybackSource } from '@/lib/playback-state';
import type { RhythmMeasure } from '@/types';

export type { PlaybackPass, PlaybackSource };

/** Tempo preference + change handler (stable across beat flash / pass updates). */
export type MetronomeTempoContextValue = {
	tempo: number;
	handleTempoChange: (updated: number) => void;
	setTempo: Dispatch<SetStateAction<number>>;
};

/**
 * Audio-clock epoch for Scroll highway progress (same timeline as scheduleHit).
 * Stable getters read refs so rAF can sample without React state each frame.
 */
export type HighwayClock = {
	getAudioNow: () => number;
	/** `firstPlaybackAt` (or demo→student restart); null when idle. */
	getOriginAt: () => number | null;
	/** Accumulated audio seconds spent in bar lookahead holds. */
	getHeldSec: () => number;
	/** Last-step audio time to freeze at while lookahead is held; null when not held. */
	getHoldStartedAt: () => number | null;
};

/** Playback clock / transport — does not include tempo. */
export type MetronomeContextValue = {
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
	/** Scroll highway samples this for judgment-line progress. */
	highwayClock: HighwayClock;
	setPlaybackMeasure: (measure: RhythmMeasure | null) => void;
	/** @deprecated Preview measure is no longer used; listen pass uses the carousel measure. */
	setPreviewMeasure: (measure: RhythmMeasure | null) => void;
	toggleMetronome: () => void;
	toggleMeasures: () => void;
	startMetronome: () => void;
	stop: () => void;
};

export const MetronomeTempoContext =
	createContext<MetronomeTempoContextValue | null>(null);

export const MetronomeContext = createContext<MetronomeContextValue | null>(
	null,
);

export function useMetronomeTempo(): MetronomeTempoContextValue {
	const context = useContext(MetronomeTempoContext);
	if (!context) {
		throw new Error('useMetronomeTempo must be used within MetronomeProvider');
	}
	return context;
}

export function useMetronome(): MetronomeContextValue {
	const context = useContext(MetronomeContext);
	if (!context) {
		throw new Error('useMetronome must be used within MetronomeProvider');
	}
	return context;
}
