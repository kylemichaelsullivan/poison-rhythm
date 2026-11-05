import clsx from 'clsx';

type ScrollHighwayNoteProps = {
	/** Travel axis: bars sit perpendicular to scroll direction. */
	vertical: boolean;
};

/**
 * Capsule hit marker on the scroll highway (rounded bar, not a dot).
 * Fills the slot cross-track; short along the travel axis.
 */
export function ScrollHighwayNote({ vertical }: ScrollHighwayNoteProps) {
	return (
		<div
			className={clsx(
				'ScrollHighwayNote border-2 border-primary bg-primary shadow-soft',
				vertical ? 'h-2 w-full rounded-full' : 'h-full w-2 rounded-full',
			)}
			title='Hit'
			aria-hidden='true'
		/>
	);
}

/** Size along the travel axis (for centering insets); matches `h-2` / `w-2`. */
export const SCROLL_HIGHWAY_GEM_ALONG_PX = 8;

/** Fraction of the viewport cross-track the gem fills. */
export const SCROLL_HIGHWAY_GEM_CROSS_FRACTION = 0.8;

/** Fixed height of the horizontal highway viewport (gems use 80% of this). */
export const SCROLL_HIGHWAY_HORIZONTAL_VIEWPORT_PX = 72;
