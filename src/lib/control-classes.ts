import clsx from 'clsx';

/** Page shell surface (inverts with theme). */
export const pageSurfaceClassName = 'bg-white text-black';

/** Inset panels (sections, empty prompts). */
export const darkSurfaceClassName = 'bg-surface text-black';

/** Modal backdrop scrim. */
export const modalScrimClassName = 'bg-scrim';

/** Modal dialog panel surface. */
export const modalPanelClassName =
	'bg-white text-black backdrop-blur-md border border-mid shadow-lg';

/** Settings grouping panel inside modals. */
export const settingsPanelClassName = 'bg-light text-dark';

/** Light input surface on themed backgrounds. */
export const inputSurfaceClassName =
	'border border-mid rounded bg-white text-black';

/**
 * Shared control styles for small UI controls (buttons, popovers, etc.).
 */
export const controlButtonBaseClassName =
	'border border-mid rounded bg-chrome text-black transition-colors duration-200 ease-out hover:bg-chrome-hover';

export const controlSurfaceBaseClassName =
	'border border-mid rounded bg-chrome text-black';

/** In-flow corner icon buttons; use as children of a bar with `appChromeBarClassName`. */
export const cornerControlButtonClassName =
	'flex items-center justify-center w-10 h-10';

/**
 * Shared row layout for `<header />` and `<footer />`: flex, even spacing, padding.
 */
export const appChromeBarClassName =
	'flex justify-between items-center w-full px-4 py-2';

export const focusVisibleRingClassName =
	'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-chrome';

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
	'flex justify-center items-center rounded-full bg-primary w-12 h-12 p-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:opacity-50';

export const modifyTempoButtonClassName =
	'absolute flex justify-center items-center border border-mid rounded bg-primary w-8 h-8 p-2 text-white transition hover:border-white hover:opacity-90 top-1/2 -translate-y-1/2 disabled:opacity-50';

export type SegmentControlVariant = 'segment' | 'checkbox';

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
		grow === true && 'flex-1',
		grow === 'auto' && 'flex-auto',
		className,
		focusVisibleRingClassName,
		disabled && 'cursor-not-allowed opacity-50',
		isSelected
			? 'border-primary bg-primary text-white'
			: variant === 'checkbox'
				? 'border-mid bg-light hover:border-primary hover:bg-surface-muted'
				: 'border-mid bg-surface-muted text-muted hover:bg-chrome-hover hover:text-black',
		disabled &&
			!isSelected &&
			(variant === 'checkbox'
				? 'hover:border-mid hover:bg-light'
				: 'hover:bg-surface-muted hover:text-muted'),
	);
}
