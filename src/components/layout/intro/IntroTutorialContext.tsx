import { createContext, useContext } from 'react';

export type IntroTutorialContextValue = {
	open: boolean;
	openIntro: () => void;
	closeIntro: (skipFuture: boolean) => void;
};

export const IntroTutorialContext =
	createContext<IntroTutorialContextValue | null>(null);

export function useIntroTutorial() {
	const context = useContext(IntroTutorialContext);
	if (!context) {
		throw new Error(
			'useIntroTutorial must be used within IntroTutorialProvider',
		);
	}
	return context;
}
