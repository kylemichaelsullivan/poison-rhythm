import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { usePendingDifficulty } from '@/contexts';
import { AboutPoisonRhythmContext } from './AboutPoisonRhythmContext';

export function AboutPoisonRhythmProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const { onHostModalClosed } = usePendingDifficulty();
	const openAbout = useCallback(() => setOpen(true), []);
	const closeAbout = useCallback(() => {
		setOpen(false);
		onHostModalClosed();
	}, [onHostModalClosed]);

	const value = useMemo(
		() => ({ open, openAbout, closeAbout }),
		[open, openAbout, closeAbout],
	);

	return (
		<AboutPoisonRhythmContext.Provider value={value}>
			{children}
		</AboutPoisonRhythmContext.Provider>
	);
}
