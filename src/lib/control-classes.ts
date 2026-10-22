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
 * Shared control styles for small UI controls (buttons, popovers, etc.).
 */
/**
 * Chrome icon/action buttons. On header/footer bars, CSS overrides the hover
 * border to the bar’s complement (Secondary on Header, Dominant on Footer).
 * Flat at rest; elevation only on hover.
 */
export const controlButtonBaseClassName =
	'AppChromeControl border border-mid rounded bg-chrome text-black transition-[colors,box-shadow] duration-200 ease-out hover:border-primary hover:bg-chrome-hover hover:shadow-soft focus-visible:shadow-soft';

export const controlSurfaceBaseClassName =
	'border border-mid rounded bg-chrome text-black';

/** In-flow corner icon buttons; use as children of a bar with `appChromeBarClassName`. */
export const cornerControlButtonClassName =
	'flex items-center justify-center min-w-11 min-h-11 w-11 h-11';

/**
 * Shared row layout for `<header />` and `<footer />`: flex, even spacing, padding.
 * Horizontal safe-area keeps chrome clear of notches; pair with header/footer extras.
 */
export const appChromeBarClassName =
	'flex justify-between items-center w-full gap-2 py-2 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]';
/** Top safe-area for the header chrome bar (notch / status bar). */
export const appChromeBarHeaderClassName =
	'pt-[max(0.5rem,env(safe-area-inset-top))]';

/** Bottom safe-area for the footer chrome bar (home indicator). */
export const appChromeBarFooterClassName =
	'pb-[max(0.5rem,env(safe-area-inset-bottom))]';

/**
 * When side-gutter controls collapse under their host (`max-[63rem]`), reserve
 * space so absolute controls (anchored with `bottom`) clear the host and
 * whatever follows (PlayControls, Tap, …).
 *
 * Formula: `--side-gutter-collapse-gap` + `--side-gutter-control-size` +
 * `--side-gutter-collapse-inset` (tokens in `src/index.css` `@theme`).
 */
export const sideGutterCollapsedReserveClassName =
	'max-[63rem]:pb-[calc(var(--side-gutter-collapse-gap)+var(--side-gutter-control-size)+var(--side-gutter-collapse-inset))]';

export const focusVisibleRingClassName =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chrome';

/**
 * Shared Settings interactive chrome (`.InteractiveInsetChrome` in
 * `src/index.css`): inset ring + raised shadow on :hover / :focus-visible via
 * CSS custom properties. Dark mode uses a white lift so active chips still
 * read elevation. Prefer this over stacking Tailwind ring + shadow utilities.
 * Resting chips stay flat.
 */
export const interactiveInsetChromeClassName = 'InteractiveInsetChrome';

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
	'outline outline-[3px] outline-offset-2 outline-black';

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
	'flex size-12 shrink-0 aspect-square items-center justify-center rounded-full border-4 border-secondary bg-primary p-3 text-on-primary transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-raised focus-visible:shadow-raised disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:opacity-50';

export const modifyTempoButtonClassName =
	'flex size-11 shrink-0 aspect-square items-center justify-center rounded-full border-2 border-primary-border bg-primary p-2 text-on-primary transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-soft focus-visible:shadow-soft disabled:opacity-50';
/**
 * Sit a control just outside a `relative` parent’s left (`start`) or right
 * (`end`) edge (`--side-gutter-width`). Optional collapse drops to the bottom
 * corners when the page has no lateral gutter (below ~63rem), with
 * `--side-gutter-collapse-gap` under the host — pair the host with
 * `sideGutterCollapsedReserveClassName`.
 */
export function sideGutterControlClassName(
	side: 'start' | 'end',
	{ collapseBelowGutter = false }: { collapseBelowGutter?: boolean } = {},
): string {
	return clsx(
		'absolute top-1/2 z-10 -translate-y-1/2',
		side === 'start'
			? 'right-[calc(100%+var(--side-gutter-width))]'
			: 'left-[calc(100%+var(--side-gutter-width))]',
		collapseBelowGutter &&
			(side === 'start'
				? 'max-[63rem]:top-auto max-[63rem]:bottom-[var(--side-gutter-collapse-inset)] max-[63rem]:right-auto max-[63rem]:left-[var(--side-gutter-collapse-inset)] max-[63rem]:translate-y-0'
				: 'max-[63rem]:top-auto max-[63rem]:bottom-[var(--side-gutter-collapse-inset)] max-[63rem]:left-auto max-[63rem]:right-[var(--side-gutter-collapse-inset)] max-[63rem]:translate-y-0'),
	);
}

export type SegmentControlVariant = 'segment' | 'checkbox' | 'header';

/** Segment / toggle chip used in settings and similar option rows. */
export function segmentControlClassName(
	isSelected: boolean,
	{
		disabled = false,
		grow = true,
		variant = 'segment',
		className,
	}: {
		disabled?: boolean;
		/** `true` → flex-1; `'auto'` → flex-auto; `false` → no flex grow. */
		grow?: boolean | 'auto';
		variant?: SegmentControlVariant;
		className?: string;
	} = {},
): string {
	return clsx(
		'flex min-h-11 items-center justify-center rounded border p-2 text-sm transition-[colors,box-shadow]',
		variant === 'header' && 'size-11 shrink-0 p-1.5',
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
				? clsx('border-mid bg-light', !disabled && 'hover:bg-surface-muted')
				: variant === 'header'
					? 'border-2 border-secondary bg-surface text-black'
					: clsx(
							'border-secondary bg-surface-muted text-black',
							!disabled && 'hover:bg-chrome-hover',
						),
	);
}
