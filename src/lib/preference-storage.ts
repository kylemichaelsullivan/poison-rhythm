import { BPM_DEFAULT } from './metronome-defaults';
import {
	parseColorPreference,
	parseCountInEnabled,
	parseDifficulty,
	parseExplicitTrue,
	parseSubdivisionLevel,
	parseTempo,
	parseTempoMax,
	parseTempoMin,
	parseThemeSetting,
	serializeColorPreference,
	serializeCountInEnabled,
	serializeDifficulty,
	serializeExplicitTrue,
	serializeSubdivisionLevel,
	serializeTempo,
	serializeTempoMax,
	serializeTempoMin,
	serializeThemeSetting,
} from './preference-schemas';
import {
	readStorageItem,
	removeStorageItem,
	writeStorageItem,
} from './storage';
import {
	DEFAULT_PROFILE_ID,
	LEGACY_STORAGE_KEYS,
	preferenceStorageKey,
} from './storage-keys';
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
	parseTempoMax,
	parseTempoMin,
	parseThemeSetting,
	serializeTempoMax,
	serializeTempoMin,
} from './preference-schemas';
export type {
	ColorPreference,
	SubdivisionLevel,
	ThemeSetting,
} from './preference-schemas';

/** Imperative helpers default to this id (ProfilesProvider keeps it in sync). */
let imperativeProfileId = DEFAULT_PROFILE_ID;

export function getImperativeProfileId(): string {
	return imperativeProfileId;
}

export function setImperativeProfileId(profileId: string): void {
	imperativeProfileId = profileId;
}

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

function profileKey(
	name: Parameters<typeof preferenceStorageKey>[0],
	profileId: string = imperativeProfileId,
): string {
	return preferenceStorageKey(name, profileId);
}

export function readThemeSetting(
	profileId: string = imperativeProfileId,
): ThemeSetting {
	return readPreference(profileKey('theme', profileId), parseThemeSetting);
}

export function writeThemeSetting(
	value: ThemeSetting,
	profileId: string = imperativeProfileId,
): void {
	writePreference(profileKey('theme', profileId), serializeThemeSetting(value));
}

export function readSubdivisionLevel(
	profileId: string = imperativeProfileId,
): SubdivisionLevel {
	return readPreference(
		profileKey('subdivision', profileId),
		parseSubdivisionLevel,
	);
}

export function writeSubdivisionLevel(
	level: SubdivisionLevel,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('subdivision', profileId),
		serializeSubdivisionLevel(level),
	);
}

export function readMuteMetronome(
	profileId: string = imperativeProfileId,
): boolean {
	return readPreference(
		profileKey('muteMetronome', profileId),
		parseExplicitTrue,
	);
}

export function writeMuteMetronome(
	muted: boolean,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('muteMetronome', profileId),
		serializeExplicitTrue(muted),
	);
}

export function readMutePlayback(
	profileId: string = imperativeProfileId,
): boolean {
	return readPreference(
		profileKey('mutePlayback', profileId),
		parseExplicitTrue,
	);
}

export function writeMutePlayback(
	muted: boolean,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('mutePlayback', profileId),
		serializeExplicitTrue(muted),
	);
}

export function readMutePreview(
	profileId: string = imperativeProfileId,
): boolean {
	return readPreference(
		profileKey('mutePreview', profileId),
		parseExplicitTrue,
	);
}

export function writeMutePreview(
	muted: boolean,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('mutePreview', profileId),
		serializeExplicitTrue(muted),
	);
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

function peekLegacyMuteOnStudentPass(profileId: string): boolean {
	const raw = readStorageItem(profileKey('gameSettings', profileId));
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

function stripLegacyMuteOnStudentPass(profileId: string): void {
	const key = profileKey('gameSettings', profileId);
	const raw = readStorageItem(key);
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
		writeStorageItem(key, JSON.stringify(record));
	} catch {
		// Corrupt settings fall back in parseGameSettings.
	}
}

const rhythmMutesResolvedByProfile = new Map<string, RhythmMuteState>();

/**
 * Resolve Playback / Preview mutes once per profile load.
 * Migrates legacy `muteRhythm` (both muted) and `muteOnStudentPass` (Playback only).
 */
export function resolveRhythmMutes(
	profileId: string = imperativeProfileId,
): RhythmMuteState {
	const cached = rhythmMutesResolvedByProfile.get(profileId);
	if (cached) {
		return cached;
	}

	const playbackRaw = readStorageItem(profileKey('mutePlayback', profileId));
	const previewRaw = readStorageItem(profileKey('mutePreview', profileId));
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
		const legacyStudent = peekLegacyMuteOnStudentPass(profileId);
		mutePlayback = legacyRhythm || legacyStudent;
		mutePreview = legacyRhythm;
		writeMutePlayback(mutePlayback, profileId);
		writeMutePreview(mutePreview, profileId);
		removeStorageItem(LEGACY_STORAGE_KEYS.muteRhythm);
	}

	stripLegacyMuteOnStudentPass(profileId);
	const resolved = { mutePlayback, mutePreview };
	rhythmMutesResolvedByProfile.set(profileId, resolved);
	return resolved;
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
export function readCountInEnabled(
	profileId: string = imperativeProfileId,
): boolean {
	const stored = readPreference(
		profileKey('countInEnabled', profileId),
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

export function writeCountInEnabled(
	enabled: boolean,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('countInEnabled', profileId),
		serializeCountInEnabled(enabled),
	);
	removeStorageItem(LEGACY_STORAGE_KEYS.muteCountIn);
}

export function readDifficulty(
	profileId: string = imperativeProfileId,
): number {
	return readPreference(profileKey('difficulty', profileId), parseDifficulty);
}

export function writeDifficulty(
	value: number,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('difficulty', profileId),
		serializeDifficulty(value),
	);
}

export function readStoredTempo(
	profileId: string = imperativeProfileId,
): number | null {
	return readPreference(profileKey('tempo', profileId), parseTempo);
}

export function writeStoredTempo(
	value: number,
	profileId: string = imperativeProfileId,
): void {
	writePreference(profileKey('tempo', profileId), serializeTempo(value));
}

export function readTempoMin(profileId: string = imperativeProfileId): number {
	return readPreference(profileKey('tempoMin', profileId), parseTempoMin);
}

export function writeTempoMin(
	value: number,
	profileId: string = imperativeProfileId,
): void {
	writePreference(profileKey('tempoMin', profileId), serializeTempoMin(value));
}

export function readTempoMax(profileId: string = imperativeProfileId): number {
	return readPreference(profileKey('tempoMax', profileId), parseTempoMax);
}

export function writeTempoMax(
	value: number,
	profileId: string = imperativeProfileId,
): void {
	writePreference(profileKey('tempoMax', profileId), serializeTempoMax(value));
}

export function readDominantColor(
	profileId: string = imperativeProfileId,
): ColorPreference {
	return readPreference(
		profileKey('dominantColor', profileId),
		parseColorPreference,
	);
}

export function writeDominantColor(
	value: ColorPreference,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('dominantColor', profileId),
		serializeColorPreference(value),
	);
}

export function readSecondaryColor(
	profileId: string = imperativeProfileId,
): ColorPreference {
	return readPreference(
		profileKey('secondaryColor', profileId),
		parseColorPreference,
	);
}

export function writeSecondaryColor(
	value: ColorPreference,
	profileId: string = imperativeProfileId,
): void {
	writePreference(
		profileKey('secondaryColor', profileId),
		serializeColorPreference(value),
	);
}

/** First-visit welcome is shown until the student opts to skip it on this device. */
export function readIntroSeen(): boolean {
	return readPreference(preferenceStorageKey('introSeen'), parseExplicitTrue);
}

export function writeIntroSeen(seen: boolean): void {
	writePreference(
		preferenceStorageKey('introSeen'),
		serializeExplicitTrue(seen),
	);
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

const initialTempoResolvedByProfile = new Map<string, number>();
let bpmSearchParamConsumed = false;

/** @internal Test helper */
export function resetPreferenceBootstrapForTests(): void {
	initialTempoResolvedByProfile.clear();
	bpmSearchParamConsumed = false;
	rhythmMutesResolvedByProfile.clear();
	imperativeProfileId = DEFAULT_PROFILE_ID;
}

/** URL ?bpm= overrides storage once; param is stripped from the address bar. */
export function resolveInitialTempo(
	profileId: string = imperativeProfileId,
): number {
	const cached = initialTempoResolvedByProfile.get(profileId);
	if (cached !== undefined) {
		return cached;
	}

	if (typeof globalThis.location === 'undefined') {
		initialTempoResolvedByProfile.set(profileId, BPM_DEFAULT);
		return BPM_DEFAULT;
	}

	if (!bpmSearchParamConsumed) {
		const fromUrl = readTempoFromSearchParams(globalThis.location.search);
		if (fromUrl !== null) {
			stripBpmSearchParam();
			bpmSearchParamConsumed = true;
			writeStoredTempo(fromUrl, profileId);
			initialTempoResolvedByProfile.set(profileId, fromUrl);
			return fromUrl;
		}
		bpmSearchParamConsumed = true;
	}

	const fromStorage = readStoredTempo(profileId) ?? BPM_DEFAULT;
	initialTempoResolvedByProfile.set(profileId, fromStorage);
	return fromStorage;
}

/** @deprecated Use readMuteMetronome / writeMuteMetronome */
export function readMutePreference(key: string): boolean {
	return readPreference(key, parseExplicitTrue);
}

/** @deprecated Use writeMuteMetronome / writeMutePlayback */
export function writeMutePreference(key: string, muted: boolean): void {
	writePreference(key, serializeExplicitTrue(muted));
}
