import { useEffect } from 'react';
import { loadMusiSyncFont } from '@/lib/notation';
import type { RhythmRenderMode } from '@/lib/settings-schema';

/** Prefetch the notation chunk and MusiSync font when render mode is notation. */
export function useNotationPrefetch(
	renderMode: RhythmRenderMode,
	importNotation: () => Promise<unknown>,
): void {
	useEffect(() => {
		if (renderMode !== 'notation') return;
		void importNotation();
		void loadMusiSyncFont();
	}, [renderMode, importNotation]);
}
