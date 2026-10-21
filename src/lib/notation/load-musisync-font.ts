import { MUSISYNC_GLYPH } from './musisync-glyphs';

const FAMILY = 'MusiSync';

/**
 * Quarter / eighth / sixteenth note keys used by the header ShowNotes control.
 * Passed to `document.fonts.load` so those glyphs resolve as soon as the face is ready.
 */
export const MUSISYNC_SUBDIVISION_NOTE_GLYPHS = [
	MUSISYNC_GLYPH.quarterNote,
	MUSISYNC_GLYPH.eighthNote,
	MUSISYNC_GLYPH.sixteenthNote,
].join('');

/** Size used for load/check; matches ShowNotesTriggerGlyph. */
export const MUSISYNC_SUBDIVISION_FONT_SPEC = `34px "${FAMILY}"`;

let loadPromise: Promise<boolean> | null = null;

/**
 * True only when `MusiSync` paints differently from a monospace fallback.
 * Ink height alone is not enough — any face can draw literal `q` / `e` / `s`.
 */
function subdivisionGlyphsPaintable(): boolean {
	if (typeof document === 'undefined') return false;
	const canvas = document.createElement('canvas');
	const size = 64;
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) return false;

	const paint = (font: string): Uint8ClampedArray => {
		ctx.clearRect(0, 0, size, size);
		ctx.font = font;
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#000';
		ctx.fillText(MUSISYNC_SUBDIVISION_NOTE_GLYPHS, 4, 48);
		return ctx.getImageData(0, 0, size, size).data;
	};

	const musi = paint(MUSISYNC_SUBDIVISION_FONT_SPEC);
	const fallback = paint('34px ui-monospace, monospace');
	let diff = 0;
	for (let i = 0; i < musi.length; i++) {
		if (musi[i] !== fallback[i]) diff++;
	}
	// MusiSync notes are far from letters; a handful of AA pixels is not enough.
	return diff > 80;
}

export function isMusiSyncFontReady(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}
	if (
		document.fonts.check(
			MUSISYNC_SUBDIVISION_FONT_SPEC,
			MUSISYNC_SUBDIVISION_NOTE_GLYPHS,
		)
	) {
		return true;
	}
	// Some engines report check() false even after a successful load(); verify via metrics.
	return subdivisionGlyphsPaintable();
}

/** Force the browser to rasterize the three subdivision note glyphs. */
function warmSubdivisionNoteGlyphs(): void {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.font = MUSISYNC_SUBDIVISION_FONT_SPEC;
	for (const glyph of MUSISYNC_SUBDIVISION_NOTE_GLYPHS) {
		ctx.fillText(glyph, 0, 24);
	}
}

/**
 * Triggers download of the CSS `@font-face` for MusiSync (`/fonts/*` from `public/fonts`).
 * Resolves once quarter / eighth / sixteenth note glyphs are available.
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
		.load(MUSISYNC_SUBDIVISION_FONT_SPEC, MUSISYNC_SUBDIVISION_NOTE_GLYPHS)
		.then(async (faces) => {
			await document.fonts.ready;
			warmSubdivisionNoteGlyphs();
			const ready =
				faces.length > 0 ||
				document.fonts.check(
					MUSISYNC_SUBDIVISION_FONT_SPEC,
					MUSISYNC_SUBDIVISION_NOTE_GLYPHS,
				) ||
				subdivisionGlyphsPaintable();
			if (!ready) {
				loadPromise = null;
				return false;
			}
			return true;
		})
		.catch(() => {
			loadPromise = null;
			return false;
		});

	return loadPromise;
}

/**
 * Start MusiSync + subdivision glyph load without blocking the caller.
 * Safe to call from `main` before React mounts; pairs with the `index.html` preload.
 */
export function prefetchMusiSyncFont(): void {
	if (typeof document === 'undefined') return;
	void loadMusiSyncFont();
}
