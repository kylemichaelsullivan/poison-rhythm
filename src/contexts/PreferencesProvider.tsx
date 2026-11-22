import { useCallback, useMemo } from 'react';
import {
	ComplexityPreferencesContext,
	SoundPreferencesContext,
	TempoPreferencesContext,
} from '@/contexts/PreferencesContext';
import { useActiveProfileId } from '@/contexts/ProfilesContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { clampTempo, normalizeTempoLimits } from '@/lib/metronome-tempo';
import {
	serializeCountInEnabled,
	serializeDifficulty,
	serializeExplicitTrue,
	serializeSubdivisionLevel,
	serializeTempo,
	serializeTempoMax,
	serializeTempoMin,
} from '@/lib/preference-schemas';
import {
	DEFAULT_DIFFICULTY,
	DEFAULT_SUBDIVISION_LEVEL,
	parseCountInEnabledStored,
	parseDifficulty,
	parseExplicitTrue,
	parseStoredTempo,
	parseSubdivisionLevel,
	parseTempoMax,
	parseTempoMin,
	readCountInEnabled,
	resolveInitialTempo,
	resolveRhythmMutes,
} from '@/lib/preference-storage';
import { removeStorageItem } from '@/lib/storage';
import { LEGACY_STORAGE_KEYS, preferenceStorageKey } from '@/lib/storage-keys';
import type { ReactNode } from 'react';

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const profileId = useActiveProfileId();
	resolveRhythmMutes(profileId);

	const [subdivisionLevel, setSubdivisionLevel] = useLocalStorage({
		key: preferenceStorageKey('subdivision', profileId),
		parse: parseSubdivisionLevel,
		serialize: serializeSubdivisionLevel,
		getDefault: () => DEFAULT_SUBDIVISION_LEVEL,
	});

	const [muteMetronome, setMuteMetronome] = useLocalStorage({
		key: preferenceStorageKey('muteMetronome', profileId),
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const [countInEnabled, setCountInEnabledState] = useLocalStorage({
		key: preferenceStorageKey('countInEnabled', profileId),
		parse: parseCountInEnabledStored,
		serialize: serializeCountInEnabled,
		getDefault: () => readCountInEnabled(profileId),
	});

	const [mutePlayback, setMutePlaybackState] = useLocalStorage({
		key: preferenceStorageKey('mutePlayback', profileId),
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const [mutePreview, setMutePreviewState] = useLocalStorage({
		key: preferenceStorageKey('mutePreview', profileId),
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});

	const setMutePlayback = setMutePlaybackState;
	const setMutePreview = setMutePreviewState;

	const [difficulty, setDifficulty] = useLocalStorage({
		key: preferenceStorageKey('difficulty', profileId),
		parse: parseDifficulty,
		serialize: serializeDifficulty,
		getDefault: () => DEFAULT_DIFFICULTY,
	});

	const [tempoMinRaw, setTempoMinRaw] = useLocalStorage({
		key: preferenceStorageKey('tempoMin', profileId),
		parse: parseTempoMin,
		serialize: serializeTempoMin,
		getDefault: () => BPM_MIN,
	});

	const [tempoMaxRaw, setTempoMaxRaw] = useLocalStorage({
		key: preferenceStorageKey('tempoMax', profileId),
		parse: parseTempoMax,
		serialize: serializeTempoMax,
		getDefault: () => BPM_MAX,
	});

	const { tempoMin, tempoMax } = normalizeTempoLimits(tempoMinRaw, tempoMaxRaw);

	const [tempo, setTempoState] = useLocalStorage({
		key: preferenceStorageKey('tempo', profileId),
		parse: parseStoredTempo,
		serialize: serializeTempo,
		getDefault: () => resolveInitialTempo(profileId),
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
				clampTempo(
					typeof next === 'function' ? next(previous) : next,
					tempoMin,
					tempoMax,
				),
			);
		},
		[setTempoState, tempoMin, tempoMax],
	);

	const setTempoMin = useCallback(
		(next: number) => {
			const limits = normalizeTempoLimits(next, tempoMaxRaw);
			setTempoMinRaw(limits.tempoMin);
			setTempoMaxRaw(limits.tempoMax);
			setTempoState((previous) =>
				clampTempo(previous, limits.tempoMin, limits.tempoMax),
			);
		},
		[setTempoMinRaw, setTempoMaxRaw, setTempoState, tempoMaxRaw],
	);

	const setTempoMax = useCallback(
		(next: number) => {
			const limits = normalizeTempoLimits(tempoMinRaw, next);
			setTempoMinRaw(limits.tempoMin);
			setTempoMaxRaw(limits.tempoMax);
			setTempoState((previous) =>
				clampTempo(previous, limits.tempoMin, limits.tempoMax),
			);
		},
		[setTempoMinRaw, setTempoMaxRaw, setTempoState, tempoMinRaw],
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
			tempoMin,
			tempoMax,
			setTempoMin,
			setTempoMax,
		}),
		[tempo, setTempo, tempoMin, tempoMax, setTempoMin, setTempoMax],
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
