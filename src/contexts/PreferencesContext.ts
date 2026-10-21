import { createContext, useContext } from 'react';
import type { SubdivisionLevel } from '@/lib/preference-storage';

export type { SubdivisionLevel };

export type ComplexityPreferencesValue = {
	subdivisionLevel: SubdivisionLevel;
	setSubdivisionLevel: (level: SubdivisionLevel) => void;
	difficulty: number;
	setDifficulty: (value: number) => void;
};

/** Channel mutes + count-in (no tempo — tempo lives in TempoPreferences). */
export type SoundPreferencesValue = {
	muteMetronome: boolean;
	setMuteMetronome: (muted: boolean) => void;
	countInEnabled: boolean;
	setCountInEnabled: (enabled: boolean) => void;
	muteRhythmSounds: boolean;
	setMuteRhythmSounds: (muted: boolean) => void;
};

export type TempoPreferencesValue = {
	tempo: number;
	setTempo: (value: number | ((prev: number) => number)) => void;
};

/** Combined sound + tempo for callers that still want both. */
export type PlaybackPreferencesValue = SoundPreferencesValue &
	TempoPreferencesValue;

/** Combined shape for callers that need complexity + playback prefs. */
export type PreferencesContextValue = ComplexityPreferencesValue &
	PlaybackPreferencesValue;

export type PlaybackMuteChannel = 'metronome' | 'rhythm';

export const ComplexityPreferencesContext =
	createContext<ComplexityPreferencesValue | null>(null);

export const SoundPreferencesContext =
	createContext<SoundPreferencesValue | null>(null);

export const TempoPreferencesContext =
	createContext<TempoPreferencesValue | null>(null);

export function useComplexityPreferences(): ComplexityPreferencesValue {
	const ctx = useContext(ComplexityPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'useComplexityPreferences must be used within PreferencesProvider',
		);
	}
	return ctx;
}

export function useSoundPreferences(): SoundPreferencesValue {
	const ctx = useContext(SoundPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'useSoundPreferences must be used within PreferencesProvider',
		);
	}
	return ctx;
}

export function useTempoPreference(): TempoPreferencesValue {
	const ctx = useContext(TempoPreferencesContext);
	if (ctx == null) {
		throw new Error(
			'useTempoPreference must be used within PreferencesProvider',
		);
	}
	return ctx;
}

/** Sound + tempo (re-renders on either). Prefer narrow hooks when possible. */
export function usePlaybackPreferences(): PlaybackPreferencesValue {
	return {
		...useSoundPreferences(),
		...useTempoPreference(),
	};
}

/** Subscribes to complexity + sound + tempo (re-renders on any pref change). */
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

/** One mute channel — does not re-render when the other channel or tempo changes. */
export function usePlaybackMute(channel: PlaybackMuteChannel) {
	const {
		muteMetronome,
		setMuteMetronome,
		muteRhythmSounds,
		setMuteRhythmSounds,
	} = useSoundPreferences();

	if (channel === 'metronome') {
		return { muted: muteMetronome, setMuted: setMuteMetronome } as const;
	}
	return { muted: muteRhythmSounds, setMuted: setMuteRhythmSounds } as const;
}
