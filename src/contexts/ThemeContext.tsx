import type { ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	useSyncExternalStore,
} from 'react';

const STORAGE_KEY = 'poison-rhythm-theme';

function getStoredTheme(): 'light' | 'dark' | null {
	if (typeof window === 'undefined') return null;
	const s = localStorage.getItem(STORAGE_KEY);
	return s === 'light' || s === 'dark' ? s : null;
}

function subscribeToSystemTheme(cb: () => void) {
	const m = window.matchMedia('(prefers-color-scheme: dark)');
	m.addEventListener('change', cb);
	return () => m.removeEventListener('change', cb);
}

function getSystemDark() {
	return (
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	);
}

type ThemeContextValue = {
	/** User override; null = follow system (prefers-color-scheme) */
	theme: 'light' | 'dark' | null;
	setTheme: (theme: 'light' | 'dark' | null) => void;
	effectiveTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<'light' | 'dark' | null>(
		getStoredTheme,
	);
	const systemDark = useSyncExternalStore(
		subscribeToSystemTheme,
		getSystemDark,
		() => false,
	);

	const setTheme = useCallback((next: 'light' | 'dark' | null) => {
		setThemeState(next);
		if (next === null) {
			localStorage.removeItem(STORAGE_KEY);
		} else {
			localStorage.setItem(STORAGE_KEY, next);
		}
	}, []);

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
		if (theme === null) root.removeAttribute('data-theme');
		else root.setAttribute('data-theme', theme);
	}, [theme]);

	const value: ThemeContextValue = {
		theme,
		setTheme,
		effectiveTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (ctx == null)
		throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}
