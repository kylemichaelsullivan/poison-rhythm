import { BPM_DEFAULT } from './metronome-defaults';
import {
	parseColorPreference,
	parseCountInEnabled,
	parseDifficulty,
	parseExplicitTrue,
	parseSubdivisionLevel,
	parseTempo,
	parseThemeSetting,
	serializeColorPreference,
	serializeCountInEnabled,
	serializeDifficulty,
	serializeExplicitTrue,
	serializeSubdivisionLevel,
	serializeTempo,
	serializeThemeSetting,
} from './preference-schemas';
import {
	readStorageItem,
	removeStorageItem,
	writeStorageItem,
} from './storage';
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from './storage-keys';
import type {
	ColorPreference,
	SubdivisionLevel,
	ThemeSetting,
} from './preference-schemas';

export {
	DEFAULT_DIFFICULTY,
	DEFAULT_SUBDIVISION_LEVEL,
	parseColorPreference,
	parseCountInEnabled,
	parseDifficulty,
	parseExplicitTrue,
	parseSubdivisionLevel,
	parseTempo,
	parseThemeSetting,
} from './preference-schemas';
export type {
	ColorPreference,
	SubdivisionLevel,
	ThemeSetting,
} from './preference-schemas';

export function parseStoredTempo(raw: string | null): number {
	const parsed = parseTempo(raw);
	return parsed ?? BPM_DEFAULT;
}

export function parseCountInEnabledStored(raw: string | null): boolean {
	const parsed = parseCountInEnabled(raw);
	if (parsed !== null) {
		return parsed;
	}

	return readCountInEnabled();
}

function readPreference<T>(key: string, parse: (raw: string | null) => T): T {
	return parse(readStorageItem(key));
}

function writePreference(key: string, value: string | null): void {
	if (value === null) {
		removeStorageItem(key);
		return;
	}

	writeStorageItem(key, value);
}

export function readThemeSetting(): ThemeSetting {
	return readPreference(STORAGE_KEYS.theme, parseThemeSetting);
}

export function writeThemeSetting(value: ThemeSetting): void {
	writePreference(STORAGE_KEYS.theme, serializeThemeSetting(value));
}

export function readSubdivisionLevel(): SubdivisionLevel {
	return readPreference(STORAGE_KEYS.subdivision, parseSubdivisionLevel);
}

export function writeSubdivisionLevel(level: SubdivisionLevel): void {
	writePreference(STORAGE_KEYS.subdivision, serializeSubdivisionLevel(level));
}

export function readMuteMetronome(): boolean {
	return readPreference(STORAGE_KEYS.muteMetronome, parseExplicitTrue);
}

export function writeMuteMetronome(muted: boolean): void {
	writePreference(STORAGE_KEYS.muteMetronome, serializeExplicitTrue(muted));
}

export function readMutePlayback(): boolean {
	return readPreference(STORAGE_KEYS.mutePlayback, parseExplicitTrue);
}

export function writeMutePlayback(muted: boolean): void {
	writePreference(STORAGE_KEYS.mutePlayback, serializeExplicitTrue(muted));
}

export function readMutePreview(): boolean {
	return readPreference(STORAGE_KEYS.mutePreview, parseExplicitTrue);
}

export function writeMutePreview(muted: boolean): void {
	writePreference(STORAGE_KEYS.mutePreview, serializeExplicitTrue(muted));
}

export type RhythmMuteState = {
	mutePlayback: boolean;
	mutePreview: boolean;
};

/** Stored Playback / Preview flags as-is (Preview-only mute is allowed). */
export function coerceRhythmMutes(
	mutePlayback: boolean,
	mutePreview: boolean,
): RhythmMuteState {
	return { mutePlayback, mutePreview };
}

function peekLegacyMuteOnStudentPass(): boolean {
	const raw = readStorageItem(STORAGE_KEYS.gameSettings);
	if (raw === null) {
		return false;
	}

	try {
		const parsed = JSON.parse(raw) as unknown;
		return (
			Boolean(parsed) &&
			typeof parsed === 'object' &&
			!Array.isArray(parsed) &&
			(parsed as { muteOnStudentPass?: unknown }).muteOnStudentPass === true
		);
	} catch {
		return false;
	}
}

function stripLegacyMuteOnStudentPass(): void {
	const raw = readStorageItem(STORAGE_KEYS.gameSettings);
	if (raw === null) {
		return;
	}

	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return;
		}
		const record = parsed as Record<string, unknown>;
		if (!('muteOnStudentPass' in record)) {
			return;
		}
		delete record.muteOnStudentPass;
		writeStorageItem(STORAGE_KEYS.gameSettings, JSON.stringify(record));
	} catch {
		// Corrupt settings fall back in parseGameSettings.
	}
}

let rhythmMutesResolved: RhythmMuteState | null = null;

/**
 * Resolve Playback / Preview mutes once per load.
 * Migrates legacy `muteRhythm` (both muted) and `muteOnStudentPass` (Playback only).
 */
export function resolveRhythmMutes(): RhythmMuteState {
	if (rhythmMutesResolved !== null) {
		return rhythmMutesResolved;
	}

	const playbackRaw = readStorageItem(STORAGE_KEYS.mutePlayback);
	const previewRaw = readStorageItem(STORAGE_KEYS.mutePreview);
	const hasNewKeys = playbackRaw !== null || previewRaw !== null;

	let mutePlayback: boolean;
	let mutePreview: boolean;

	if (hasNewKeys) {
		mutePlayback = parseExplicitTrue(playbackRaw);
		mutePreview = parseExplicitTrue(previewRaw);
	} else {
		const legacyRhythm = parseExplicitTrue(
			readStorageItem(LEGACY_STORAGE_KEYS.muteRhythm),
		);
		const legacyStudent = peekLegacyMuteOnStudentPass();
		mutePlayback = legacyRhythm || legacyStudent;
		mutePreview = legacyRhythm;
		writeMutePlayback(mutePlayback);
		writeMutePreview(mutePreview);
		removeStorageItem(LEGACY_STORAGE_KEYS.muteRhythm);
	}

	stripLegacyMuteOnStudentPass();
	rhythmMutesResolved = { mutePlayback, mutePreview };
	return rhythmMutesResolved;
}

/** @deprecated Use readMutePlayback */
export function readMuteRhythmSounds(): boolean {
	return readMutePlayback();
}

/** @deprecated Use writeMutePlayback */
export function writeMuteRhythmSounds(muted: boolean): void {
	writeMutePlayback(muted);
}

/** Count-in is enabled unless explicitly stored as false (legacy mute key honored once). */
export function readCountInEnabled(): boolean {
	const stored = readPreference(
		STORAGE_KEYS.countInEnabled,
		parseCountInEnabled,
	);
	if (stored !== null) {
		return stored;
	}

	if (readStorageItem(LEGACY_STORAGE_KEYS.muteCountIn) === 'true') {
		return false;
	}

	return true;
}

export function writeCountInEnabled(enabled: boolean): void {
	writePreference(
		STORAGE_KEYS.countInEnabled,
		serializeCountInEnabled(enabled),
	);
	removeStorageItem(LEGACY_STORAGE_KEYS.muteCountIn);
}

export function readDifficulty(): number {
	return readPreference(STORAGE_KEYS.difficulty, parseDifficulty);
}

export function writeDifficulty(value: number): void {
	writePreference(STORAGE_KEYS.difficulty, serializeDifficulty(value));
}

export function readStoredTempo(): number | null {
	return readPreference(STORAGE_KEYS.tempo, parseTempo);
}

export function writeStoredTempo(value: number): void {
	writePreference(STORAGE_KEYS.tempo, serializeTempo(value));
}

export function readDominantColor(): ColorPreference {
	return readPreference(STORAGE_KEYS.dominantColor, parseColorPreference);
}

export function writeDominantColor(value: ColorPreference): void {
	writePreference(STORAGE_KEYS.dominantColor, serializeColorPreference(value));
}

export function readSecondaryColor(): ColorPreference {
	return readPreference(STORAGE_KEYS.secondaryColor, parseColorPreference);
}

export function writeSecondaryColor(value: ColorPreference): void {
	writePreference(STORAGE_KEYS.secondaryColor, serializeColorPreference(value));
}

/** First-visit welcome is shown until the student opts to skip it on this device. */
export function readIntroSeen(): boolean {
	return readPreference(STORAGE_KEYS.introSeen, parseExplicitTrue);
}

export function writeIntroSeen(seen: boolean): void {
	writePreference(STORAGE_KEYS.introSeen, serializeExplicitTrue(seen));
}

function readTempoFromSearchParams(search: string): number | null {
	const param = new URLSearchParams(search).get('bpm');
	if (!param) {
		return null;
	}

	return parseTempo(param);
}

export function stripBpmSearchParam(): void {
	if (typeof globalThis.location === 'undefined') {
		return;
	}

	const url = new URL(globalThis.location.href);
	if (!url.searchParams.has('bpm')) {
		return;
	}

	url.searchParams.delete('bpm');
	const next = url.pathname + (url.search ? url.search : '') + url.hash;
	globalThis.history.replaceState(globalThis.history.state, '', next);
}

let initialTempoResolved: number | null = null;

/** @internal Test helper */
export function resetPreferenceBootstrapForTests(): void {
	initialTempoResolved = null;
	rhythmMutesResolved = null;
}

/** URL ?bpm= overrides storage once; param is stripped from the address bar. */
export function resolveInitialTempo(): number {
	if (initialTempoResolved !== null) {
		return initialTempoResolved;
	}

	if (typeof globalThis.location === 'undefined') {
		initialTempoResolved = BPM_DEFAULT;
		return initialTempoResolved;
	}

	const fromUrl = readTempoFromSearchParams(globalThis.location.search);
	if (fromUrl !== null) {
		stripBpmSearchParam();
		writeStoredTempo(fromUrl);
		initialTempoResolved = fromUrl;
		return fromUrl;
	}

	initialTempoResolved = readStoredTempo() ?? BPM_DEFAULT;
	return initialTempoResolved;
}

/** @deprecated Use readMuteMetronome / writeMuteMetronome */
export function readMutePreference(key: string): boolean {
	return readPreference(key, parseExplicitTrue);
}

/** @deprecated Use writeMuteMetronome / writeMutePlayback */
export function writeMutePreference(key: string, muted: boolean): void {
	writePreference(key, serializeExplicitTrue(muted));
}
