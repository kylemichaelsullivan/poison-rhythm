import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useActiveProfileId } from '@/contexts/ProfilesContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
	parseThemeSetting,
	serializeThemeSetting,
} from '@/lib/preference-schemas';
import { preferenceStorageKey } from '@/lib/storage-keys';
import type { ReactNode } from 'react';
import type { ThemeSetting } from '@/lib/preference-schemas';

function subscribeToSystemTheme(cb: () => void) {
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	media.addEventListener('change', cb);
	return () => media.removeEventListener('change', cb);
}

function getSystemDark() {
	return (
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const profileId = useActiveProfileId();
	const [theme, setTheme] = useLocalStorage({
		key: preferenceStorageKey('theme', profileId),
		parse: parseThemeSetting,
		serialize: serializeThemeSetting,
		getDefault: () => null,
	});

	const systemDark = useSyncExternalStore(
		subscribeToSystemTheme,
		getSystemDark,
		() => false,
	);

	const effectiveTheme: 'light' | 'dark' =
		theme === 'light'
			? 'light'
			: theme === 'dark'
				? 'dark'
				: systemDark
					? 'dark'
					: 'light';

	useEffect(() => {
		const root = document.documentElement;
		if (theme === null) {
			root.removeAttribute('data-theme');
		} else {
			root.setAttribute('data-theme', theme);
		}
	}, [theme]);

	const setThemePreference = useCallback(
		(next: ThemeSetting) => setTheme(next),
		[setTheme],
	);

	const value = useMemo(
		() => ({
			theme,
			setTheme: setThemePreference,
			effectiveTheme,
		}),
		[theme, setThemePreference, effectiveTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
