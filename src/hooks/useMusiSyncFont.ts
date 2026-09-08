import { useEffect, useState } from 'react';
import {
	isMusiSyncFontReady,
	loadMusiSyncFont,
} from '@/lib/notation/load-musisync-font';

/**
 * True once MusiSync load has settled (ready or failed).
 * Start false until the attempt finishes so glyphs are not painted in a fallback face.
 */
export function useMusiSyncFont(): boolean {
	const [ready, setReady] = useState(isMusiSyncFontReady);

	useEffect(() => {
		if (isMusiSyncFontReady()) {
			setReady(true);
			return;
		}

		let cancelled = false;

		void loadMusiSyncFont().finally(() => {
			if (!cancelled) {
				setReady(true);
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return ready;
}
