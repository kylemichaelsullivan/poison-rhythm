import type { ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	useSyncExternalStore,
} from 'react';

const THEME_STORAGE_KEY = 'poison-rhythm-theme';
const SUBDIVISION_STORAGE_KEY = 'poison-rhythm-subdivision';

export type SubdivisionLevel = 'quarters' | 'eighths' | 'sixteenths';

/** Default when nothing is stored: show 1/4s, 1/8s, and 1/16s */
const DEFAULT_SUBDIVISION_LEVEL: SubdivisionLevel = 'sixteenths';

function getStoredTheme(): 'light' | 'dark' | null {
	if (typeof window === 'undefined') return null;
	const s = localStorage.getItem(THEME_STORAGE_KEY);
	return s === 'light' || s === 'dark' ? s : null;
}

function getStoredSubdivision(): SubdivisionLevel {
	if (typeof window === 'undefined') return DEFAULT_SUBDIVISION_LEVEL;
	const s = localStorage.getItem(SUBDIVISION_STORAGE_KEY);
	return s === 'quarters' || s === 'eighths' || s === 'sixteenths'
		? s
		: DEFAULT_SUBDIVISION_LEVEL;
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
	subdivisionLevel: SubdivisionLevel;
	setSubdivisionLevel: (level: SubdivisionLevel) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<'light' | 'dark' | null>(
		getStoredTheme,
	);
	const [subdivisionLevel, setSubdivisionLevelState] = useState<SubdivisionLevel>(
		getStoredSubdivision,
	);
	const systemDark = useSyncExternalStore(
		subscribeToSystemTheme,
		getSystemDark,
		() => false,
	);

	const setTheme = useCallback((next: 'light' | 'dark' | null) => {
		setThemeState(next);
		if (next === null) {
			localStorage.removeItem(THEME_STORAGE_KEY);
		} else {
			localStorage.setItem(THEME_STORAGE_KEY, next);
		}
	}, []);

	const setSubdivisionLevel = useCallback((level: SubdivisionLevel) => {
		setSubdivisionLevelState(level);
		localStorage.setItem(SUBDIVISION_STORAGE_KEY, level);
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
		subdivisionLevel,
		setSubdivisionLevel,
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
