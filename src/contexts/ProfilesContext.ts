import { createContext, useContext } from 'react';
import type { ProfileRecord, ProfilesRegistry } from '@/lib/profiles';

export type ProfilesContextValue = {
	profiles: ProfileRecord[];
	activeProfileId: string;
	activeProfile: ProfileRecord;
	switchProfile: (profileId: string) => void;
	createProfile: (name: string) => ProfileRecord;
	renameProfile: (profileId: string, name: string) => void;
	deleteProfile: (profileId: string) => void;
	/** Reorder by moving `profileId` to `toIndex` (0-based). */
	reorderProfile: (profileId: string, toIndex: number) => void;
	moveProfile: (profileId: string, direction: 'up' | 'down') => void;
};

export const ProfilesContext = createContext<ProfilesContextValue | null>(null);

export function useProfiles(): ProfilesContextValue {
	const ctx = useContext(ProfilesContext);
	if (ctx == null) {
		throw new Error('useProfiles must be used within ProfilesProvider');
	}
	return ctx;
}

export function useActiveProfileId(): string {
	return useProfiles().activeProfileId;
}

/** Narrow hook for registry shape when tests need the raw snapshot. */
export type { ProfilesRegistry };
