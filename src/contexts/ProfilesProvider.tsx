import { useCallback, useEffect, useMemo } from 'react';
import { ProfilesContext } from '@/contexts/ProfilesContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { setImperativeProfileId } from '@/lib/preference-storage';
import {
	createProfileId,
	deleteProfilePreferenceKeys,
	ensureProfilesRegistry,
	isDefaultProfileId,
	parseProfilesRegistry,
	reorderProfileList,
	sanitizeProfileName,
	serializeProfilesRegistry,
} from '@/lib/profiles';
import { DEVICE_STORAGE_KEYS } from '@/lib/storage-keys';
import type { ReactNode } from 'react';
import type { ProfileRecord, ProfilesRegistry } from '@/lib/profiles';

function readInitialRegistry(): ProfilesRegistry {
	return ensureProfilesRegistry();
}

export function ProfilesProvider({ children }: { children: ReactNode }) {
	const [registry, setRegistry] = useLocalStorage({
		key: DEVICE_STORAGE_KEYS.profiles,
		parse: (raw) => parseProfilesRegistry(raw) ?? readInitialRegistry(),
		serialize: serializeProfilesRegistry,
		getDefault: readInitialRegistry,
	});

	useEffect(() => {
		setImperativeProfileId(registry.activeProfileId);
	}, [registry.activeProfileId]);

	const activeProfile =
		registry.profiles.find(
			(profile) => profile.id === registry.activeProfileId,
		) ?? registry.profiles[0];

	const switchProfile = useCallback(
		(profileId: string) => {
			setRegistry((previous) => {
				if (!previous.profiles.some((profile) => profile.id === profileId)) {
					return previous;
				}
				if (previous.activeProfileId === profileId) {
					return previous;
				}
				setImperativeProfileId(profileId);
				return { ...previous, activeProfileId: profileId };
			});
		},
		[setRegistry],
	);

	const createProfile = useCallback(
		(name: string): ProfileRecord => {
			const trimmed = sanitizeProfileName(name);
			const profile: ProfileRecord = {
				id: createProfileId(),
				name: trimmed.length > 0 ? trimmed : 'Player',
				createdAt: Date.now(),
			};
			setRegistry((previous) => {
				setImperativeProfileId(profile.id);
				return {
					activeProfileId: profile.id,
					profiles: [...previous.profiles, profile],
				};
			});
			return profile;
		},
		[setRegistry],
	);

	const renameProfile = useCallback(
		(profileId: string, name: string) => {
			if (isDefaultProfileId(profileId)) {
				return;
			}
			const trimmed = sanitizeProfileName(name);
			if (trimmed.length === 0) {
				return;
			}
			setRegistry((previous) => ({
				...previous,
				profiles: previous.profiles.map((profile) =>
					profile.id === profileId ? { ...profile, name: trimmed } : profile,
				),
			}));
		},
		[setRegistry],
	);

	const deleteProfile = useCallback(
		(profileId: string) => {
			setRegistry((previous) => {
				if (isDefaultProfileId(profileId)) {
					return previous;
				}
				if (previous.profiles.length <= 1) {
					return previous;
				}
				if (previous.activeProfileId === profileId) {
					return previous;
				}
				deleteProfilePreferenceKeys(profileId);
				return {
					...previous,
					profiles: previous.profiles.filter(
						(profile) => profile.id !== profileId,
					),
				};
			});
		},
		[setRegistry],
	);

	const reorderProfile = useCallback(
		(profileId: string, toIndex: number) => {
			setRegistry((previous) => {
				const fromIndex = previous.profiles.findIndex(
					(profile) => profile.id === profileId,
				);
				if (fromIndex < 0) {
					return previous;
				}
				const profiles = reorderProfileList(
					previous.profiles,
					fromIndex,
					toIndex,
				);
				if (profiles === previous.profiles) {
					return previous;
				}
				return { ...previous, profiles };
			});
		},
		[setRegistry],
	);

	const moveProfile = useCallback(
		(profileId: string, direction: 'up' | 'down') => {
			setRegistry((previous) => {
				const fromIndex = previous.profiles.findIndex(
					(profile) => profile.id === profileId,
				);
				if (fromIndex < 0) {
					return previous;
				}
				const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
				const profiles = reorderProfileList(
					previous.profiles,
					fromIndex,
					toIndex,
				);
				if (profiles === previous.profiles) {
					return previous;
				}
				return { ...previous, profiles };
			});
		},
		[setRegistry],
	);

	const value = useMemo(
		() => ({
			profiles: registry.profiles,
			activeProfileId: registry.activeProfileId,
			activeProfile,
			switchProfile,
			createProfile,
			renameProfile,
			deleteProfile,
			reorderProfile,
			moveProfile,
		}),
		[
			registry.profiles,
			registry.activeProfileId,
			activeProfile,
			switchProfile,
			createProfile,
			renameProfile,
			deleteProfile,
			reorderProfile,
			moveProfile,
		],
	);

	return (
		<ProfilesContext.Provider value={value}>
			{children}
		</ProfilesContext.Provider>
	);
}
