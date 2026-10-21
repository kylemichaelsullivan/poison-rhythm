import { useLayoutEffect, useRef } from 'react';
import { MUSISYNC_SUBDIVISION_FONT_SPEC } from '@/lib/notation/load-musisync-font';

const BUTTON_SIZE_PX = 44;
/** Leave chrome breathing room so stems/flags never kiss the border. */
const MIN_PAD_PX = 5;
/** Prefer filling this fraction of the button when the glyph is small. */
const TARGET_INK_FRACTION = 0.68;
const ALPHA_INK = 24;

/** Matches `--color-ink-950` / light-mode `--color-black`. */
const INK_LIGHT_FALLBACK = '#0d090e';
/** Matches `--color-ink-50` / dark-mode `--color-black`. */
const INK_DARK_FALLBACK = '#faf9fc';

type ShowNotesTriggerGlyphProps = {
	glyph: string;
	ready: boolean;
	/** Canvas pixels do not track CSS theme flips; re-paint when this changes. */
	effectiveTheme: 'light' | 'dark';
};

/** Resolve a CSS color to something Canvas 2D will paint (hex / rgb). */
function toCanvasFill(cssColor: string, fallback: string): string {
	const probe = document.createElement('canvas').getContext('2d');
	if (!probe) return fallback;
	probe.fillStyle = fallback;
	try {
		probe.fillStyle = cssColor;
	} catch {
		return fallback;
	}
	const applied = probe.fillStyle;
	if (applied.startsWith('#') || applied.startsWith('rgb')) {
		return applied;
	}
	// Engines that keep oklch() on the getter still paint it; prefer computed ink token.
	return cssColor.startsWith('oklch') ? cssColor : fallback;
}

/**
 * Ink for the glyph on `bg-chrome`. Uses stable `--color-ink-*` tokens keyed by
 * `effectiveTheme` instead of live `color` / `--color-black`: ThemeProvider
 * applies `data-theme` in an effect, so a layout paint that only read computed
 * style could still see the previous theme’s black.
 */
function inkFillForTheme(effectiveTheme: 'light' | 'dark'): string {
	const fallback =
		effectiveTheme === 'dark' ? INK_DARK_FALLBACK : INK_LIGHT_FALLBACK;
	const token =
		effectiveTheme === 'dark' ? '--color-ink-50' : '--color-ink-950';
	const raw = getComputedStyle(document.documentElement)
		.getPropertyValue(token)
		.trim();
	return toCanvasFill(raw || fallback, fallback);
}

type InkBounds = {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
};

/** Bounding box of painted ink in CSS pixels. */
function measureInkBounds(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	dpr: number,
): InkBounds | null {
	const { data } = ctx.getImageData(0, 0, width, height);
	let minX = width;
	let minY = height;
	let maxX = 0;
	let maxY = 0;
	let found = false;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const a = data[(y * width + x) * 4 + 3];
			if (a < ALPHA_INK) continue;
			found = true;
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
	}

	if (!found) return null;

	return {
		minX: minX / dpr,
		minY: minY / dpr,
		maxX: maxX / dpr,
		maxY: maxY / dpr,
	};
}

/**
 * Draws a MusiSync duration glyph centered by ink bounding box (not the em
 * box or ink mass). Noteheads sit low-left of stems/flags, so mass centering
 * parks the head in the middle and leaves the stem kissing a corner; bbox
 * centering keeps equal chrome padding for quarter / eighth / sixteenth.
 * Canvas-only so a missing face never paints literal `q` / `e` / `s` into the DOM.
 */
export function ShowNotesTriggerGlyph({
	glyph,
	ready,
	effectiveTheme,
}: ShowNotesTriggerGlyphProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useLayoutEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = BUTTON_SIZE_PX * dpr;
		canvas.height = BUTTON_SIZE_PX * dpr;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, BUTTON_SIZE_PX, BUTTON_SIZE_PX);

		if (!ready) return;

		const fill = inkFillForTheme(effectiveTheme);

		// Probe pass: draw at a known origin, measure real ink bounds.
		const probe = document.createElement('canvas');
		const probeCss = BUTTON_SIZE_PX * 2;
		probe.width = probeCss * dpr;
		probe.height = probeCss * dpr;
		const pctx = probe.getContext('2d');
		if (!pctx) return;

		pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		pctx.clearRect(0, 0, probeCss, probeCss);
		pctx.font = MUSISYNC_SUBDIVISION_FONT_SPEC;
		pctx.textAlign = 'left';
		pctx.textBaseline = 'alphabetic';
		pctx.fillStyle = fill;

		const originX = probeCss / 2;
		const originY = probeCss / 2;
		pctx.fillText(glyph, originX, originY);

		const bounds = measureInkBounds(pctx, probe.width, probe.height, dpr);
		if (!bounds) return;

		const inkH = bounds.maxY - bounds.minY;
		const inkW = bounds.maxX - bounds.minX;
		if (!(inkH > 0 && inkW > 0)) return;

		const maxInk = BUTTON_SIZE_PX - MIN_PAD_PX * 2;
		const scale = Math.min(
			(BUTTON_SIZE_PX * TARGET_INK_FRACTION) / inkH,
			(BUTTON_SIZE_PX * TARGET_INK_FRACTION) / inkW,
			maxInk / inkH,
			maxInk / inkW,
			1.25,
		);

		const inkCx = (bounds.minX + bounds.maxX) / 2;
		const inkCy = (bounds.minY + bounds.maxY) / 2;
		const dx = inkCx - originX;
		const dy = inkCy - originY;

		ctx.save();
		ctx.translate(BUTTON_SIZE_PX / 2, BUTTON_SIZE_PX / 2);
		ctx.scale(scale, scale);
		ctx.font = MUSISYNC_SUBDIVISION_FONT_SPEC;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = fill;
		ctx.fillText(glyph, -dx, -dy);
		ctx.restore();
	}, [glyph, ready, effectiveTheme]);

	return (
		<canvas
			ref={canvasRef}
			className='pointer-events-none block size-11'
			width={BUTTON_SIZE_PX}
			height={BUTTON_SIZE_PX}
			aria-hidden
		/>
	);
}
