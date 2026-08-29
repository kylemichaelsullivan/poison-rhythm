import type { ReactNode } from 'react';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
	parseThemeSetting,
	serializeThemeSetting,
	type ThemeSetting,
} from '@/lib/preference-schemas';
import { STORAGE_KEYS } from '@/lib/storage-keys';

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
	const [theme, setTheme] = useLocalStorage({
		key: STORAGE_KEYS.theme,
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

	const value = {
		theme,
		setTheme: setThemePreference,
		effectiveTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
