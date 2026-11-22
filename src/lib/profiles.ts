import { z } from 'zod';
import {
	readStorageItem,
	removeStorageItem,
	writeStorageItem,
} from './storage';
import {
	DEFAULT_PROFILE_ID,
	DEFAULT_PROFILE_NAME,
	DEVICE_STORAGE_KEYS,
	FLAT_PROFILE_STORAGE_KEYS,
	LEGACY_STORAGE_KEYS,
	PROFILE_PREF_SUFFIXES,
	preferenceStorageKey,
} from './storage-keys';
import type { ProfilePreferenceKeyName } from './storage-keys';

export const profileRecordSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1).max(40),
	createdAt: z.number().int().nonnegative(),
});

export type ProfileRecord = z.infer<typeof profileRecordSchema>;

export const profilesRegistrySchema = z.object({
	activeProfileId: z.string().min(1),
	profiles: z.array(profileRecordSchema).min(1),
});

export type ProfilesRegistry = z.infer<typeof profilesRegistrySchema>;

export function createProfileId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isDefaultProfileId(profileId: string): boolean {
	return profileId === DEFAULT_PROFILE_ID;
}

export function createDefaultRegistry(now = Date.now()): ProfilesRegistry {
	return {
		activeProfileId: DEFAULT_PROFILE_ID,
		profiles: [
			{
				id: DEFAULT_PROFILE_ID,
				name: DEFAULT_PROFILE_NAME,
				createdAt: now,
			},
		],
	};
}

/** Keep the built-in default id named Default (migrates legacy “Player 1”). */
export function normalizeProfilesRegistry(
	registry: ProfilesRegistry,
): ProfilesRegistry {
	let changed = false;
	const profiles = registry.profiles.map((profile) => {
		if (
			isDefaultProfileId(profile.id) &&
			profile.name !== DEFAULT_PROFILE_NAME
		) {
			changed = true;
			return { ...profile, name: DEFAULT_PROFILE_NAME };
		}
		return profile;
	});
	if (!changed) {
		return registry;
	}
	return { ...registry, profiles };
}

export function reorderProfileList(
	profiles: ProfileRecord[],
	fromIndex: number,
	toIndex: number,
): ProfileRecord[] {
	if (
		fromIndex === toIndex ||
		fromIndex < 0 ||
		toIndex < 0 ||
		fromIndex >= profiles.length ||
		toIndex >= profiles.length
	) {
		return profiles;
	}
	const next = [...profiles];
	const [moved] = next.splice(fromIndex, 1);
	if (!moved) {
		return profiles;
	}
	next.splice(toIndex, 0, moved);
	return next;
}

function migrateFlatKeysIntoProfile(profileId: string): void {
	for (const name of Object.keys(
		PROFILE_PREF_SUFFIXES,
	) as ProfilePreferenceKeyName[]) {
		const flatKey = FLAT_PROFILE_STORAGE_KEYS[name];
		const raw = readStorageItem(flatKey);
		if (raw !== null) {
			writeStorageItem(preferenceStorageKey(name, profileId), raw);
			removeStorageItem(flatKey);
		}
	}

	// Legacy mute keys stay flat until resolveRhythmMutes runs against the
	// namespaced profile keys; copy them only if new keys were absent.
	const legacyRhythm = readStorageItem(LEGACY_STORAGE_KEYS.muteRhythm);
	if (legacyRhythm !== null) {
		const playbackKey = preferenceStorageKey('mutePlayback', profileId);
		const previewKey = preferenceStorageKey('mutePreview', profileId);
		if (readStorageItem(playbackKey) === null) {
			writeStorageItem(playbackKey, legacyRhythm);
		}
		if (readStorageItem(previewKey) === null) {
			writeStorageItem(previewKey, legacyRhythm);
		}
		removeStorageItem(LEGACY_STORAGE_KEYS.muteRhythm);
	}

	const legacyCountIn = readStorageItem(LEGACY_STORAGE_KEYS.muteCountIn);
	if (legacyCountIn !== null) {
		const countInKey = preferenceStorageKey('countInEnabled', profileId);
		if (readStorageItem(countInKey) === null && legacyCountIn === 'true') {
			writeStorageItem(countInKey, 'false');
		}
		removeStorageItem(LEGACY_STORAGE_KEYS.muteCountIn);
	}
}

export function parseProfilesRegistry(
	raw: string | null,
): ProfilesRegistry | null {
	if (raw === null) {
		return null;
	}
	try {
		const parsed = profilesRegistrySchema.safeParse(JSON.parse(raw));
		if (!parsed.success) {
			return null;
		}
		const activeExists = parsed.data.profiles.some(
			(profile) => profile.id === parsed.data.activeProfileId,
		);
		if (!activeExists) {
			return null;
		}
		return normalizeProfilesRegistry(parsed.data);
	} catch {
		return null;
	}
}

export function serializeProfilesRegistry(registry: ProfilesRegistry): string {
	return JSON.stringify(profilesRegistrySchema.parse(registry));
}

export function readProfilesRegistry(): ProfilesRegistry | null {
	return parseProfilesRegistry(readStorageItem(DEVICE_STORAGE_KEYS.profiles));
}

export function writeProfilesRegistry(registry: ProfilesRegistry): void {
	writeStorageItem(
		DEVICE_STORAGE_KEYS.profiles,
		serializeProfilesRegistry(registry),
	);
}

/**
 * Ensure a profiles registry exists. Migrates flat preference keys into the
 * default profile on first run.
 */
export function ensureProfilesRegistry(now = Date.now()): ProfilesRegistry {
	const existing = readProfilesRegistry();
	if (existing) {
		const normalized = normalizeProfilesRegistry(existing);
		if (normalized !== existing) {
			writeProfilesRegistry(normalized);
		}
		return normalized;
	}

	const registry = createDefaultRegistry(now);
	migrateFlatKeysIntoProfile(registry.activeProfileId);
	writeProfilesRegistry(registry);
	return registry;
}

export function deleteProfilePreferenceKeys(profileId: string): void {
	for (const name of Object.keys(
		PROFILE_PREF_SUFFIXES,
	) as ProfilePreferenceKeyName[]) {
		removeStorageItem(preferenceStorageKey(name, profileId));
	}
}

export function sanitizeProfileName(name: string): string {
	return name.trim().slice(0, 40);
}
