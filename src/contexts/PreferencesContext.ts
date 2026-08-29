import { createContext, useContext } from 'react';
import type { SubdivisionLevel } from '@/lib/preference-storage';

export type { SubdivisionLevel };

export type PreferencesContextValue = {
	subdivisionLevel: SubdivisionLevel;
	setSubdivisionLevel: (level: SubdivisionLevel) => void;
	muteMetronome: boolean;
	setMuteMetronome: (muted: boolean) => void;
	countInEnabled: boolean;
	setCountInEnabled: (enabled: boolean) => void;
	muteRhythmSounds: boolean;
	setMuteRhythmSounds: (muted: boolean) => void;
	difficulty: number;
	setDifficulty: (value: number) => void;
	tempo: number;
	setTempo: (value: number | ((prev: number) => number)) => void;
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(
	null,
);

export function usePreferences(): PreferencesContextValue {
	const ctx = useContext(PreferencesContext);
	if (ctx == null) {
		throw new Error('usePreferences must be used within PreferencesProvider');
	}

	return ctx;
}

export function useDifficulty() {
	const { difficulty, setDifficulty } = usePreferences();
	return { difficulty, setDifficulty };
}
