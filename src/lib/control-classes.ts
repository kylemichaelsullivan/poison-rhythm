import clsx from 'clsx';

/** Page shell surface (inverts with theme); atmosphere comes from html wash. */
export const pageSurfaceClassName = 'bg-transparent text-black';

/** Inset panels (sections, empty prompts). */
export const darkSurfaceClassName = 'bg-surface text-black shadow-raised';

/** Modal backdrop scrim. */
export const modalScrimClassName = 'bg-scrim';

/** Modal dialog panel surface. */
export const modalPanelClassName =
	'bg-white text-black backdrop-blur-md border-2 border-primary/35 shadow-overlay';

/** Settings grouping panel inside modals. */
export const settingsPanelClassName =
	'bg-light text-dark border border-mid shadow-soft';

/** Light input surface on themed backgrounds. */
export const inputSurfaceClassName =
	'border border-mid rounded bg-white text-black shadow-control focus-within:border-primary';

/**
 * Shared control styles for small UI controls (buttons, popovers, etc.).
 */
export const controlButtonBaseClassName =
	'border border-mid rounded bg-chrome text-black shadow-control transition-[colors,box-shadow] duration-200 ease-out hover:border-primary hover:bg-chrome-hover hover:shadow-soft';

export const controlSurfaceBaseClassName =
	'border border-mid rounded bg-chrome text-black shadow-control';

/** In-flow corner icon buttons; use as children of a bar with `appChromeBarClassName`. */
export const cornerControlButtonClassName =
	'flex items-center justify-center w-10 h-10';

/**
 * Shared row layout for `<header />` and `<footer />`: flex, even spacing, padding.
 */
export const appChromeBarClassName =
	'flex justify-between items-center w-full px-4 py-2 bg-chrome/80 shadow-soft';

export const focusVisibleRingClassName =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chrome';

/**
 * Hover affordance parallel to focus: same primary ring, tighter offset so
 * it isn’t identical to :focus-visible. Avoids filling/border tricks that
 * can match the selected/active look while the pointer stays over a toggle.
 */
export const hoverRingClassName =
	'hover:outline-none hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-chrome';

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
	'flex justify-center items-center rounded-full border-2 border-primary-border bg-primary w-12 h-12 p-3 text-on-primary shadow-primary-glow transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-raised disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:opacity-50';

export const modifyTempoButtonClassName =
	'flex justify-center items-center border-2 border-primary-border rounded bg-primary w-8 h-8 p-2 text-on-primary shadow-control transition hover:opacity-90 hover:shadow-soft disabled:opacity-50';

/**
 * Sit a control just outside a `relative` parent’s left (`start`) or right
 * (`end`) edge, with a 1rem gutter. Optional collapse drops to the bottom
 * corners when the page has no lateral gutter (below ~63rem).
 */
export function sideGutterControlClassName(
	side: 'start' | 'end',
	{ collapseBelowGutter = false }: { collapseBelowGutter?: boolean } = {},
): string {
	return clsx(
		'absolute top-1/2 z-10 -translate-y-1/2',
		side === 'start' ? 'right-[calc(100%+1rem)]' : 'left-[calc(100%+1rem)]',
		collapseBelowGutter &&
			(side === 'start'
				? 'max-[63rem]:top-[calc(100%+0.75rem)] max-[63rem]:right-auto max-[63rem]:left-2 max-[63rem]:translate-y-0'
				: 'max-[63rem]:top-[calc(100%+0.75rem)] max-[63rem]:left-auto max-[63rem]:right-2 max-[63rem]:translate-y-0'),
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
		'flex items-center justify-center rounded border p-2 text-sm transition-colors',
		variant === 'header' && 'size-9 shrink-0 p-1.5',
		grow === true && 'flex-1',
		grow === 'auto' && 'flex-auto',
		className,
		focusVisibleRingClassName,
		disabled && 'cursor-not-allowed opacity-50',
		!disabled && [hoverRingClassName, 'hover:border-mid'],
		isSelected
			? variant === 'header'
				? 'border-primary bg-primary/15 text-primary shadow-soft'
				: // Same-hue border (not mint primary-border): avoids speckled AA on rounded chips.
					'border-primary bg-primary text-on-primary shadow-soft'
			: variant === 'checkbox'
				? clsx(
						'border-mid bg-light shadow-control',
						!disabled && 'hover:bg-surface-muted',
					)
				: variant === 'header'
					? 'border-mid bg-chrome text-mid shadow-control'
					: clsx(
							'border-mid bg-surface-muted text-muted shadow-control',
							!disabled && 'hover:bg-chrome-hover hover:border-primary',
						),
	);
}
