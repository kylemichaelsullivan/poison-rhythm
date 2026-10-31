import clsx from 'clsx';

/** Page shell surface (inverts with theme); atmosphere comes from html wash. */
export const pageSurfaceClassName = 'bg-transparent text-black';

/** Inset panels (sections, empty prompts). */
export const darkSurfaceClassName = 'bg-surface text-black';

/** Modal backdrop scrim. */
export const modalScrimClassName = 'bg-scrim';

/** Modal dialog panel surface. */
export const modalPanelClassName =
	'bg-white text-black backdrop-blur-md border-2 border-primary/35';

/** Settings grouping panel inside modals. */
export const settingsPanelClassName = 'bg-light text-dark border border-mid';

/** Light input surface on themed backgrounds. */
export const inputSurfaceClassName =
	'border border-mid rounded bg-white text-black focus-within:border-primary';

/**
 * Chrome icon/action buttons. Hover / focus is global on `button` in
 * `src/index.css` (inset ring + lift). Header / footer override the ring to
 * the bar’s complement (Secondary on Header, Dominant on Footer).
 */
export const controlButtonBaseClassName =
	'AppChromeControl InteractiveInsetChrome border border-mid rounded bg-chrome text-black';

export const controlSurfaceBaseClassName =
	'border border-mid rounded bg-chrome text-black';

/** In-flow corner icon buttons; use as children of a bar with `appChromeBarClassName`. */
export const cornerControlButtonClassName =
	'flex items-center justify-center min-w-11 min-h-11 w-11 h-11';

/**
 * Equal side tracks so header title / footer copyright sit on the screen
 * center even when the corner controls have different widths.
 */
export const appChromeCenterTrackClassName =
	'grid-cols-[minmax(0,1fr)_minmax(0,auto)_minmax(0,1fr)]';

/**
 * Shared row layout for `<header />` and `<footer />`: three-column track,
 * padding. Horizontal safe-area keeps chrome clear of notches; pair with
 * header/footer extras.
 */
export const appChromeBarClassName = clsx(
	'grid w-full items-center gap-2 py-2',
	appChromeCenterTrackClassName,
	'pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]',
);
/** Top safe-area for the header chrome bar (notch / status bar). */
export const appChromeBarHeaderClassName =
	'pt-[max(0.5rem,env(safe-area-inset-top))]';

/** Bottom safe-area for the footer chrome bar (home indicator). */
export const appChromeBarFooterClassName =
	'pb-[max(0.5rem,env(safe-area-inset-bottom))]';

/**
 * When side-gutter controls collapse under their host (`max-gutter`, 63rem),
 * reserve space so absolute controls (anchored with `bottom`) clear the host
 * and whatever follows (PlayControls, Tap, …).
 *
 * Formula: `--side-gutter-collapse-gap` + `--side-gutter-control-size` +
 * `--side-gutter-collapse-inset` (tokens in `src/index.css` `@theme`).
 */
export const sideGutterCollapsedReserveClassName =
	'max-gutter:pb-gutter-reserve';

const sideGutterCollapseBaseClassName =
	'max-gutter:top-auto max-gutter:bottom-gutter-inset max-gutter:translate-y-0';

function sideGutterCollapseInsetClassName(side: 'start' | 'end'): string {
	return side === 'start'
		? 'max-gutter:right-auto max-gutter:left-gutter-inset'
		: 'max-gutter:left-auto max-gutter:right-gutter-inset';
}

export const focusVisibleRingClassName =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chrome';

/**
 * Same inset ring + lift as global `button` hover / focus. Use on non-button
 * chips, or to mark a control that already owns the tokens. Dark mode uses a
 * white lift so active chips still read elevation.
 */
export const interactiveInsetChromeClassName = 'InteractiveInsetChrome';

/**
 * Dominant-filled controls (Play, New, Next, tempo ±, …). Pair with
 * `data-chrome-active` so hover / focus matches header mute chips: inset
 * complement ring + lift, no fill or ink change.
 */
export const primaryFillChromeClassName = interactiveInsetChromeClassName;

/**
 * Light chrome / dark ink that do not invert with page theme. Contrast meter
 * bars and swatch grade chips stay Light-over-Dark visually in every mode.
 * Semantic `black` / `white` / `chrome` flip under `data-theme`.
 */
export const stableLightInkClassName = 'bg-ink-100 text-ink-950';
export const stableDarkInkClassName = 'bg-ink-950 text-ink-50';

/**
 * Layout-stable selection outlines for color swatches / pairings.
 * Uses `outline-black` so Light / Dark / System all track `--color-black`
 * (ink flips in dark theme).
 */
export const selectionOutlineActiveClassName =
	'outline outline-3 outline-offset-2 outline-black';

export const selectionOutlinePartnerClassName =
	'outline outline-2 outline-offset-1 outline-black';

/**
 * Shows the focus ring while the element has a `data-force-focus-ring`
 * attribute. Programmatic focus() after a mouse click doesn't match
 * :focus-visible, so callers set this attribute to make focus apparent.
 */
export const forcedFocusRingClassName =
	'data-force-focus-ring:outline-none data-force-focus-ring:ring-2 data-force-focus-ring:ring-primary data-force-focus-ring:ring-offset-2 data-force-focus-ring:ring-offset-chrome';

/** Focus an element and show the forced focus ring until it blurs. */
export function focusWithForcedRing(
	element: HTMLElement | null | undefined,
): void {
	if (!element) {
		return;
	}
	element.dataset.forceFocusRing = 'true';
	element.addEventListener(
		'blur',
		() => {
			delete element.dataset.forceFocusRing;
		},
		{ once: true },
	);
	element.focus();
}

export const roundPlayPauseButtonClassName =
	'RoundPlayPauseButton InteractiveInsetChrome flex size-12 shrink-0 aspect-square items-center justify-center rounded-full border border-primary-border bg-primary p-3 text-on-primary disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:opacity-50';

export const modifyTempoButtonClassName =
	'InteractiveInsetChrome flex size-11 shrink-0 aspect-square items-center justify-center rounded-full border border-primary-border bg-primary p-2 text-on-primary disabled:opacity-50';

/** Shared chrome for carousel prev/next and end-of-set actions. */
export function carouselNavButtonClassName(
	state: boolean | 'quiet' = false,
): string {
	const disabled = state === true;
	const quiet = state === 'quiet';

	return clsx(
		'CarouselNavButton InteractiveInsetChrome flex size-11 items-center justify-center rounded-lg border-2 p-1 text-2xl font-bold',
		disabled
			? 'cursor-not-allowed border-mid bg-surface-muted text-transparent'
			: quiet
				? 'cursor-pointer border-mid bg-surface-muted text-transparent'
				: 'border-secondary bg-surface text-black',
	);
}

/** Absolute corner slot on a `ModalPanel` (close on `end`, leading action on `start`). */
export function modalCornerControlClassName(side: 'start' | 'end'): string {
	return clsx(
		'absolute z-20 top-[max(0.35rem,env(safe-area-inset-top))] sm:top-3',
		side === 'end'
			? 'right-[max(0.35rem,env(safe-area-inset-right))] sm:right-3'
			: 'left-[max(0.35rem,env(safe-area-inset-left))] sm:left-3',
	);
}

/**
 * Sit a control just outside a `relative` parent’s left (`start`) or right
 * (`end`) edge (`--side-gutter-width`). Optional collapse drops to the bottom
 * corners when the page has no lateral gutter (`max-gutter`), with
 * `--side-gutter-collapse-gap` under the host — pair the host with
 * `sideGutterCollapsedReserveClassName`.
 */
export function sideGutterControlClassName(
	side: 'start' | 'end',
	{ collapseBelowGutter = false }: { collapseBelowGutter?: boolean } = {},
): string {
	return clsx(
		'absolute top-1/2 z-10 -translate-y-1/2',
		side === 'start' ? 'right-gutter-outside' : 'left-gutter-outside',
		collapseBelowGutter && sideGutterCollapseBaseClassName,
		collapseBelowGutter && sideGutterCollapseInsetClassName(side),
	);
}

export type SegmentControlVariant = 'segment' | 'checkbox' | 'header';
export type SegmentControlSize = 'md' | 'sm';

/** Segment / toggle chip used in settings and similar option rows. */
export function segmentControlClassName(
	isSelected: boolean,
	{
		disabled = false,
		grow = true,
		variant = 'segment',
		size = 'md',
		className,
	}: {
		disabled?: boolean;
		/** `true` → flex-1; `'auto'` → flex-auto; `false` → no flex grow. */
		grow?: boolean | 'auto';
		variant?: SegmentControlVariant;
		size?: SegmentControlSize;
		className?: string;
	} = {},
): string {
	return clsx(
		'flex items-center justify-center rounded border text-sm transition-[colors,box-shadow]',
		variant === 'header'
			? 'size-11 shrink-0 p-1.5'
			: size === 'sm'
				? 'size-6 shrink-0 p-0.5'
				: 'min-h-11 p-2',
		grow === true && 'flex-1',
		grow === 'auto' && 'flex-auto',
		className,
		interactiveInsetChromeClassName,
		disabled && 'cursor-not-allowed opacity-50',
		isSelected
			? variant === 'header'
				? 'border-2 border-secondary bg-primary text-on-primary'
				: 'border-primary-border bg-primary text-on-primary'
			: variant === 'checkbox'
				? 'border-mid bg-light'
				: variant === 'header'
					? 'border-2 border-secondary bg-surface text-black'
					: 'border-secondary bg-surface-muted text-black',
	);
}
