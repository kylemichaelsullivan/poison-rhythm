import { MUSISYNC_BEAMED } from './beam-glyphs';
import { MUSISYNC_GLYPH } from './musisync-glyphs';

const FAMILY = 'MusiSync';
const FACE_SOURCE =
	'url("/fonts/MusiSync.woff2") format("woff2"), url("/fonts/MusiSync.ttf") format("truetype")';

/**
 * Quarter / eighth / sixteenth note keys used by the header ShowNotes control.
 * Passed to `document.fonts.load` so those glyphs resolve as soon as the face is ready.
 */
export const MUSISYNC_SUBDIVISION_NOTE_GLYPHS = [
	MUSISYNC_GLYPH.quarterNote,
	MUSISYNC_GLYPH.eighthNote,
	MUSISYNC_GLYPH.sixteenthNote,
].join('');

/** Every duration, rest, dot, and beamed glyph the app can paint. */
export const MUSISYNC_ALL_GLYPHS = Array.from(
	new Set([
		...Object.values(MUSISYNC_GLYPH),
		...Object.values(MUSISYNC_BEAMED),
	]),
).join('');

/**
 * Canvas / `document.fonts` spec. The generic stack must match `.MusiSync` so a
 * missing face compares equal to fallback (bare `"MusiSync"` falls back to the
 * canvas default sans, which is *not* equal to monospace and looks “ready”).
 */
export const MUSISYNC_FONT_STACK = `"${FAMILY}", ui-monospace, monospace`;
export const MUSISYNC_FALLBACK_FONT_SPEC = '34px ui-monospace, monospace';
/** Size used for load/check; matches ShowNotesTriggerGlyph. */
export const MUSISYNC_SUBDIVISION_FONT_SPEC = `34px ${MUSISYNC_FONT_STACK}`;

const PAINT_SIZE_PX = 64;
/** MusiSync notes are far from letters; a handful of AA pixels is not enough. */
const PAINT_DIFF_MIN = 80;
const READY_FRAME_ATTEMPTS = 12;

let loadPromise: Promise<boolean> | null = null;
let facePromise: Promise<FontFace | null> | null = null;

function normalizeFamily(family: string): string {
	return family.replace(/["']/g, '');
}

function findRegisteredFace(): FontFace | undefined {
	for (const face of document.fonts) {
		if (normalizeFamily(face.family) === FAMILY) {
			return face;
		}
	}
	return undefined;
}

/**
 * Register MusiSync via the FontFace API so decode does not wait on CSS
 * `@font-face` injection. Safe if the face is already in `document.fonts`
 * (inline `index.html` bootstrap or the stylesheet).
 */
export function ensureMusiSyncFaceRegistered(): Promise<FontFace | null> {
	if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
		return Promise.resolve(null);
	}
	if (facePromise) {
		return facePromise;
	}

	const existing = findRegisteredFace();
	if (existing) {
		if (existing.status === 'loaded') {
			return Promise.resolve(existing);
		}
		facePromise = existing.load().catch(() => existing);
		return facePromise;
	}

	const face = new FontFace(FAMILY, FACE_SOURCE, { display: 'block' });
	document.fonts.add(face);
	facePromise = face.load().catch(() => {
		facePromise = null;
		return null;
	});
	return facePromise;
}

function paintGlyphs(font: string, glyphs: string): Uint8ClampedArray | null {
	if (typeof document === 'undefined') return null;
	const canvas = document.createElement('canvas');
	canvas.width = PAINT_SIZE_PX;
	canvas.height = PAINT_SIZE_PX;
	const ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (!ctx) return null;

	ctx.clearRect(0, 0, PAINT_SIZE_PX, PAINT_SIZE_PX);
	ctx.font = font;
	ctx.textBaseline = 'alphabetic';
	ctx.fillStyle = '#000';
	ctx.fillText(glyphs, 4, 48);
	return ctx.getImageData(0, 0, PAINT_SIZE_PX, PAINT_SIZE_PX).data;
}

function pixelDiff(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
	let diff = 0;
	const len = Math.min(a.length, b.length);
	for (let i = 0; i < len; i++) {
		if (a[i] !== b[i]) diff++;
	}
	return diff;
}

/**
 * True only when `MusiSync` paints differently from the same generic fallback
 * stack. Ink height alone is not enough — any face can draw literal `q` / `e` / `s`.
 */
export function musisyncGlyphsPaintable(
	glyphs: string = MUSISYNC_SUBDIVISION_NOTE_GLYPHS,
): boolean {
	const musi = paintGlyphs(MUSISYNC_SUBDIVISION_FONT_SPEC, glyphs);
	const fallback = paintGlyphs(MUSISYNC_FALLBACK_FONT_SPEC, glyphs);
	if (!musi || !fallback) return false;
	return pixelDiff(musi, fallback) > PAINT_DIFF_MIN;
}

export function isMusiSyncFontReady(): boolean {
	if (typeof document === 'undefined') {
		return false;
	}
	// Never trust `document.fonts.check()` for Latin duration keys: engines
	// report those letters as renderable via fallback before the face arrives.
	return musisyncGlyphsPaintable();
}

/** Force the browser to rasterize every notation glyph we ship. */
function warmAllGlyphs(): void {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.font = MUSISYNC_SUBDIVISION_FONT_SPEC;
	for (const glyph of MUSISYNC_ALL_GLYPHS) {
		ctx.fillText(glyph, 0, 24);
	}
}

function nextFrame(): Promise<void> {
	return new Promise((resolve) => {
		if (typeof requestAnimationFrame === 'undefined') {
			setTimeout(resolve, 16);
			return;
		}
		requestAnimationFrame(() => resolve());
	});
}

async function waitUntilPaintable(
	attempts: number = READY_FRAME_ATTEMPTS,
): Promise<boolean> {
	for (let i = 0; i < attempts; i++) {
		warmAllGlyphs();
		if (musisyncGlyphsPaintable()) return true;
		await nextFrame();
	}
	return musisyncGlyphsPaintable();
}

/**
 * Triggers download of the CSS `@font-face` for MusiSync (`/fonts/*` from `public/fonts`).
 * Resolves once duration / beam glyphs are rasterizable (not merely downloaded).
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

	loadPromise = (async () => {
		await ensureMusiSyncFaceRegistered();
		try {
			await document.fonts.load(
				MUSISYNC_SUBDIVISION_FONT_SPEC,
				MUSISYNC_ALL_GLYPHS,
			);
			await document.fonts.ready;
		} catch {
			loadPromise = null;
			return false;
		}

		const ready = await waitUntilPaintable();
		if (!ready) {
			loadPromise = null;
			return false;
		}
		return true;
	})();

	return loadPromise;
}

/**
 * Start MusiSync + every notation glyph without blocking the caller.
 * Safe to call from `main` before React mounts; pairs with the `index.html`
 * preload + inline FontFace bootstrap.
 */
export function prefetchMusiSyncFont(): void {
	if (typeof document === 'undefined') return;
	void ensureMusiSyncFaceRegistered();
	void loadMusiSyncFont();
}
