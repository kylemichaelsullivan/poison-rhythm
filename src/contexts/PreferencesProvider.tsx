import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { PreferencesContext } from '@/contexts/PreferencesContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { clampTempo } from '@/lib/metronome-tempo';
import {
	serializeCountInEnabled,
	serializeDifficulty,
	serializeExplicitTrue,
	serializeSubdivisionLevel,
	serializeTempo,
} from '@/lib/preference-schemas';
import {
	DEFAULT_DIFFICULTY,
	DEFAULT_SUBDIVISION_LEVEL,
	parseCountInEnabledStored,
	parseDifficulty,
	parseExplicitTrue,
	parseStoredTempo,
	parseSubdivisionLevel,
	readCountInEnabled,
	resolveInitialTempo,
} from '@/lib/preference-storage';
import { removeStorageItem } from '@/lib/storage';
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/lib/storage-keys';

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const [subdivisionLevel, setSubdivisionLevel] = useLocalStorage({
		key: STORAGE_KEYS.subdivision,
		parse: parseSubdivisionLevel,
		serialize: serializeSubdivisionLevel,
		getDefault: () => DEFAULT_SUBDIVISION_LEVEL,
	});

	const [muteMetronome, setMuteMetronome] = useLocalStorage({
		key: STORAGE_KEYS.muteMetronome,
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const [countInEnabled, setCountInEnabledState] = useLocalStorage({
		key: STORAGE_KEYS.countInEnabled,
		parse: parseCountInEnabledStored,
		serialize: serializeCountInEnabled,
		getDefault: readCountInEnabled,
	});

	const [muteRhythmSounds, setMuteRhythmSounds] = useLocalStorage({
		key: STORAGE_KEYS.muteRhythm,
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const [difficulty, setDifficulty] = useLocalStorage({
		key: STORAGE_KEYS.difficulty,
		parse: parseDifficulty,
		serialize: serializeDifficulty,
		getDefault: () => DEFAULT_DIFFICULTY,
	});

	const [tempo, setTempoState] = useLocalStorage({
		key: STORAGE_KEYS.tempo,
		parse: parseStoredTempo,
		serialize: serializeTempo,
		getDefault: resolveInitialTempo,
	});

	const setCountInEnabled = useCallback(
		(enabled: boolean) => {
			setCountInEnabledState(enabled);
			removeStorageItem(LEGACY_STORAGE_KEYS.muteCountIn);
		},
		[setCountInEnabledState],
	);

	const setTempo = useCallback(
		(next: number | ((prev: number) => number)) => {
			const value = typeof next === 'function' ? next(tempo) : next;
			setTempoState(clampTempo(value));
		},
		[setTempoState, tempo],
	);

	const value = useMemo(
		() => ({
			subdivisionLevel,
			setSubdivisionLevel,
			muteMetronome,
			setMuteMetronome,
			countInEnabled,
			setCountInEnabled,
			muteRhythmSounds,
			setMuteRhythmSounds,
			difficulty,
			setDifficulty,
			tempo,
			setTempo,
		}),
		[
			subdivisionLevel,
			setSubdivisionLevel,
			muteMetronome,
			setMuteMetronome,
			countInEnabled,
			setCountInEnabled,
			muteRhythmSounds,
			setMuteRhythmSounds,
			difficulty,
			setDifficulty,
			tempo,
			setTempo,
		],
	);

	return (
		<PreferencesContext.Provider value={value}>
			{children}
		</PreferencesContext.Provider>
	);
}
