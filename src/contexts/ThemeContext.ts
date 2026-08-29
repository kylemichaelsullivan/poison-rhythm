import { createContext, useContext } from 'react';
import type { ThemeSetting } from '@/lib/preference-schemas';

export type ThemeContextValue = {
	/** User override; null = follow system (prefers-color-scheme) */
	theme: ThemeSetting;
	setTheme: (theme: ThemeSetting) => void;
	effectiveTheme: 'light' | 'dark';
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (ctx == null) {
		throw new Error('useTheme must be used within ThemeProvider');
	}

	return ctx;
}

export type { ThemeSetting };
