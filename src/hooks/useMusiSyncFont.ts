import { useEffect, useState } from 'react';
import {
	isMusiSyncFontReady,
	loadMusiSyncFont,
} from '@/lib/notation/load-musisync-font';

/** True only after MusiSync is confirmed available for glyph rendering. */
export function useMusiSyncFont(): boolean {
	const [ready, setReady] = useState(isMusiSyncFontReady);

	useEffect(() => {
		let cancelled = false;

		void loadMusiSyncFont().then((ok) => {
			if (!cancelled) {
				setReady(ok);
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	return ready;
}
