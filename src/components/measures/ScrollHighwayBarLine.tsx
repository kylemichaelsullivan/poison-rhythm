import clsx from 'clsx';

type ScrollHighwayBarLineProps = {
	/** Travel axis: bar lines sit perpendicular to scroll direction. */
	vertical: boolean;
};

/**
 * Faint downbeat (beat 1) marker on the scroll highway.
 * Thin stroke across the lane; sits under hit gems.
 */
export function ScrollHighwayBarLine({ vertical }: ScrollHighwayBarLineProps) {
	return (
		<div
			className={clsx(
				'ScrollHighwayBarLine bg-primary/20',
				vertical ? 'h-0.5 w-full' : 'h-full w-0.5',
			)}
			aria-hidden='true'
		/>
	);
}

/** Thickness along the travel axis; matches `h-0.5` / `w-0.5`. */
export const SCROLL_HIGHWAY_BAR_ALONG_PX = 2;
