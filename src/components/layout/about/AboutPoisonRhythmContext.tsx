import { createContext, useContext } from 'react';

export type AboutPoisonRhythmContextValue = {
	open: boolean;
	openAbout: () => void;
};

export const AboutPoisonRhythmContext =
	createContext<AboutPoisonRhythmContextValue | null>(null);

export function useAboutPoisonRhythm() {
	const context = useContext(AboutPoisonRhythmContext);
	if (!context) {
		throw new Error(
			'useAboutPoisonRhythm must be used within AboutPoisonRhythmProvider',
		);
	}
	return context;
}
