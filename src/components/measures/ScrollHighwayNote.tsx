import clsx from 'clsx';

type ScrollHighwayNoteProps = {
	/** Travel axis: bars sit perpendicular to scroll direction. */
	vertical: boolean;
};

/**
 * Capsule hit marker on the scroll highway (rounded bar, not a dot).
 * Cross-track long, travel-axis short — like a Guitar Hero gem lane.
 */
export function ScrollHighwayNote({ vertical }: ScrollHighwayNoteProps) {
	return (
		<div
			className={clsx(
				'ScrollHighwayNote border-2 border-primary bg-primary shadow-soft',
				vertical ? 'h-3 w-7 rounded-full' : 'h-7 w-3 rounded-full',
			)}
			title='Hit'
			aria-hidden='true'
		/>
	);
}

/** Size along the travel axis (for centering insets). */
export const SCROLL_HIGHWAY_GEM_ALONG_PX = 12;

/** Size across the travel axis (bar length). */
export const SCROLL_HIGHWAY_GEM_CROSS_PX = 28;
