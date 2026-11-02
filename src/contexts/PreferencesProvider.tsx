import { useCallback, useMemo } from 'react';
import {
	ComplexityPreferencesContext,
	SoundPreferencesContext,
	TempoPreferencesContext,
} from '@/contexts/PreferencesContext';
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
	resolveRhythmMutes,
} from '@/lib/preference-storage';
import { removeStorageItem } from '@/lib/storage';
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/lib/storage-keys';
import type { ReactNode } from 'react';

export function PreferencesProvider({ children }: { children: ReactNode }) {
	resolveRhythmMutes();

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

	const [mutePlayback, setMutePlaybackState] = useLocalStorage({
		key: STORAGE_KEYS.mutePlayback,
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const [mutePreview, setMutePreviewState] = useLocalStorage({
		key: STORAGE_KEYS.mutePreview,
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const setMutePlayback = setMutePlaybackState;
	const setMutePreview = setMutePreviewState;

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
			setTempoState((previous) =>
				clampTempo(typeof next === 'function' ? next(previous) : next),
			);
		},
		[setTempoState],
	);

	const complexityValue = useMemo(
		() => ({
			subdivisionLevel,
			setSubdivisionLevel,
			difficulty,
			setDifficulty,
		}),
		[subdivisionLevel, setSubdivisionLevel, difficulty, setDifficulty],
	);

	const soundValue = useMemo(
		() => ({
			muteMetronome,
			setMuteMetronome,
			countInEnabled,
			setCountInEnabled,
			mutePlayback,
			setMutePlayback,
			mutePreview,
			setMutePreview,
		}),
		[
			muteMetronome,
			setMuteMetronome,
			countInEnabled,
			setCountInEnabled,
			mutePlayback,
			setMutePlayback,
			mutePreview,
			setMutePreview,
		],
	);

	const tempoValue = useMemo(
		() => ({
			tempo,
			setTempo,
		}),
		[tempo, setTempo],
	);

	return (
		<ComplexityPreferencesContext.Provider value={complexityValue}>
			<SoundPreferencesContext.Provider value={soundValue}>
				<TempoPreferencesContext.Provider value={tempoValue}>
					{children}
				</TempoPreferencesContext.Provider>
			</SoundPreferencesContext.Provider>
		</ComplexityPreferencesContext.Provider>
	);
}
