import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

type DifficultyContextValue = {
	difficulty: number;
	setDifficulty: (value: number) => void;
};

const DifficultyContext = createContext<DifficultyContextValue | null>(null);

type DifficultyProviderProps = {
	children: ReactNode;
	defaultValue?: number;
};

export function DifficultyProvider({
	children,
	defaultValue = 3,
}: DifficultyProviderProps) {
	const [difficulty, setDifficulty] = useState(defaultValue);

	const value: DifficultyContextValue = {
		difficulty,
		setDifficulty: useCallback((v: number) => setDifficulty(v), []),
	};

	return (
		<DifficultyContext.Provider value={value}>
			{children}
		</DifficultyContext.Provider>
	);
}

export function useDifficulty(): DifficultyContextValue {
	const ctx = useContext(DifficultyContext);
	if (!ctx) {
		throw new Error('useDifficulty must be used within DifficultyProvider');
	}
	return ctx;
}
