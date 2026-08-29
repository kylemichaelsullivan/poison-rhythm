import { useCallback } from 'react';
import { useSettings } from '@/contexts';
import type { GameSettings } from '@/lib/settings-schema';

export function useUpdateSetting() {
	const { settings, updateSettings } = useSettings();

	const set = useCallback(
		<K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
			updateSettings({ [key]: value });
		},
		[updateSettings],
	);

	return { settings, updateSettings, set };
}
