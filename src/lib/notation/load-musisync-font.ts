const FAMILY = 'MusiSync';
const TEST_STRING = `16px "${FAMILY}"`;

let loadPromise: Promise<boolean> | null = null;

export function isMusiSyncFontReady(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}
	return document.fonts.check(TEST_STRING);
}

/**
 * Triggers download of the CSS `@font-face` for MusiSync (`/fonts/*` from `public/fonts`).
 * Does not register fonts through Vite JS imports.
 */
export function loadMusiSyncFont(): Promise<boolean> {
	if (typeof document === 'undefined') {
		return Promise.resolve(false);
	}

	if (isMusiSyncFontReady()) {
		return Promise.resolve(true);
	}

	if (loadPromise) {
		return loadPromise;
	}

	loadPromise = document.fonts
		.load(TEST_STRING)
		.then(() => {
			const ready = isMusiSyncFontReady();
			if (!ready) {
				loadPromise = null;
			}
			return ready;
		})
		.catch(() => {
			loadPromise = null;
			return false;
		});

	return loadPromise;
}
