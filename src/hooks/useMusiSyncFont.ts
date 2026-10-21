import { useCallback, useEffect, useState } from 'react';
import {
	isMusiSyncFontReady,
	loadMusiSyncFont,
} from '@/lib/notation/load-musisync-font';

type MusiSyncFontState = {
	/** True only when MusiSync is confirmed available for subdivision notes. */
	ready: boolean;
	/** Retry / finish loading (e.g. on ShowNotes hover). */
	ensureLoaded: () => void;
};

/**
 * Tracks MusiSync readiness. Never reports ready on load failure, so UI can
 * avoid painting fallback `q` / `e` / `s` letters.
 */
export function useMusiSyncFont(): MusiSyncFontState {
	const [ready, setReady] = useState(isMusiSyncFontReady);

	const ensureLoaded = useCallback(() => {
		if (isMusiSyncFontReady()) {
			setReady(true);
			return;
		}
		void loadMusiSyncFont().then((ok) => {
			setReady(ok || isMusiSyncFontReady());
		});
	}, []);

	useEffect(() => {
		ensureLoaded();

		if (typeof document === 'undefined') return;

		const onDone = () => {
			if (isMusiSyncFontReady()) {
				setReady(true);
			}
		};
		document.fonts.addEventListener('loadingdone', onDone);
		void document.fonts.ready.then(onDone);

		return () => {
			document.fonts.removeEventListener('loadingdone', onDone);
		};
	}, [ensureLoaded]);

	return { ready, ensureLoaded };
}
