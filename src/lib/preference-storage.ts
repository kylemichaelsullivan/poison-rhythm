import { BPM_DEFAULT } from './metronome-defaults';
import {
	parseCountInEnabled,
	parseDifficulty,
	parseExplicitTrue,
	parseSubdivisionLevel,
	parseTempo,
	parseThemeSetting,
	type SubdivisionLevel,
	serializeCountInEnabled,
	serializeDifficulty,
	serializeExplicitTrue,
	serializeSubdivisionLevel,
	serializeTempo,
	serializeThemeSetting,
	type ThemeSetting,
} from './preference-schemas';
import {
	readStorageItem,
	removeStorageItem,
	writeStorageItem,
} from './storage';
import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from './storage-keys';

export type { SubdivisionLevel, ThemeSetting } from './preference-schemas';
export {
	DEFAULT_DIFFICULTY,
	DEFAULT_SUBDIVISION_LEVEL,
	parseCountInEnabled,
	parseDifficulty,
	parseExplicitTrue,
	parseSubdivisionLevel,
	parseTempo,
	parseThemeSetting,
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

export function readMuteRhythmSounds(): boolean {
	return readPreference(STORAGE_KEYS.muteRhythm, parseExplicitTrue);
}

export function writeMuteRhythmSounds(muted: boolean): void {
	writePreference(STORAGE_KEYS.muteRhythm, serializeExplicitTrue(muted));
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

/** @deprecated Use writeMuteMetronome / writeMuteRhythmSounds */
export function writeMutePreference(key: string, muted: boolean): void {
	writePreference(key, serializeExplicitTrue(muted));
}
