import { useCallback, useSyncExternalStore } from 'react';
import { useSettingsStore } from '@/contexts/SettingsContext';
import type { GameSettings } from '@/lib/settings-schema';

/**
 * Read/write one game-settings key with a keyed subscription.
 * Unrelated setting writes do not re-render this consumer.
 */
export function useSetting<K extends keyof GameSettings>(key: K) {
	const store = useSettingsStore();
	const value = useSyncExternalStore(
		(onStoreChange) => store.subscribeKey(key, onStoreChange),
		() => store.getSettings()[key],
		() => store.getSettings()[key],
	);
	const setValue = useCallback(
		(next: GameSettings[K]) => {
			store.updateSettings({ [key]: next } as Partial<GameSettings>);
		},
		[store, key],
	);
	return [value, setValue] as const;
}
