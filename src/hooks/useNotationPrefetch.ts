import { useEffect } from 'react';
import type { RhythmRenderMode } from '@/lib/settings-schema';

/** Prefetch the notation chunk when render mode is notation. */
export function useNotationPrefetch(
	renderMode: RhythmRenderMode,
	importNotation: () => Promise<unknown>,
): void {
	useEffect(() => {
		if (renderMode !== 'notation') return;
		void importNotation();
	}, [renderMode, importNotation]);
}
