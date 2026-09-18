import { createContext, useContext } from 'react';
import type { SubdivisionLevel } from '@/lib/preference-storage';

export type { SubdivisionLevel };

export type ComplexityPreferencesValue = {
	subdivisionLevel: SubdivisionLevel;
	setSubdivisionLevel: (level: SubdivisionLevel) => void;
	difficulty: number;
	setDifficulty: (value: number) => void;
};

export type PlaybackPreferencesValue = {
	muteMetronome: boolean;
	setMuteMetronome: (muted: boolean) => void;
	countInEnabled: boolean;
	setCountInEnabled: (enabled: boolean) => void;
	muteRhythmSounds: boolean;
	setMuteRhythmSounds: (muted: boolean) => void;
	tempo: number;
	setTempo: (value: number | ((prev: number) => number)) => void;
};

/** Combined shape for callers that need complexity + playback prefs. */
export type PreferencesContextValue = ComplexityPreferencesValue &
	PlaybackPreferencesValue;

export const ComplexityPreferencesContext =
	createContext<ComplexityPreferencesValue | null>(null);

export const PlaybackPreferencesContext =
	createContext<PlaybackPreferencesValue | null>(null);

export function useComplexityPreferences(): ComplexityPreferencesValue {
	const ctx = useContext(ComplexityPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'useComplexityPreferences must be used within PreferencesProvider',
		);
	}
	return ctx;
}

export function usePlaybackPreferences(): PlaybackPreferencesValue {
	const ctx = useContext(PlaybackPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'usePlaybackPreferences must be used within PreferencesProvider',
		);
	}
	return ctx;
}

/** Subscribes to both preference slices (re-renders on any pref change). */
export function usePreferences(): PreferencesContextValue {
	return {
		...useComplexityPreferences(),
		...usePlaybackPreferences(),
	};
}

export function useDifficulty() {
	const { difficulty, setDifficulty } = useComplexityPreferences();
	return { difficulty, setDifficulty };
}

export function useSubdivision() {
	const { subdivisionLevel, setSubdivisionLevel } = useComplexityPreferences();
	return { subdivisionLevel, setSubdivisionLevel };
}
