import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
	parseExplicitTrue,
	serializeExplicitTrue,
} from '@/lib/preference-schemas';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { IntroTutorialContext } from './IntroTutorialContext';
import type { ReactNode } from 'react';

export function IntroTutorialProvider({ children }: { children: ReactNode }) {
	const [seen, setSeen] = useLocalStorage({
		key: STORAGE_KEYS.introSeen,
		parse: parseExplicitTrue,
		serialize: serializeExplicitTrue,
		getDefault: () => false,
	});
	const [sessionDismissed, setSessionDismissed] = useState(false);
	const [replay, setReplay] = useState(false);

	const open = replay || (!seen && !sessionDismissed);
	const openIntro = useCallback(() => setReplay(true), []);
	const closeIntro = useCallback(
		(skipFuture: boolean) => {
			setReplay(false);
			setSessionDismissed(true);
			if (skipFuture) {
				setSeen(true);
			}
		},
		[setSeen],
	);

	const value = useMemo(
		() => ({ open, openIntro, closeIntro }),
		[open, openIntro, closeIntro],
	);

	return (
		<IntroTutorialContext.Provider value={value}>
			{children}
		</IntroTutorialContext.Provider>
	);
}
