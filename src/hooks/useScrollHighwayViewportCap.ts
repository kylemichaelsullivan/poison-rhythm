import { useLayoutEffect, useState } from 'react';
import {
	clampHighwayAlongSpan,
	HIGHWAY_PX_PER_MEASURE,
	HIGHWAY_VIEWPORT_ALONG_PX,
} from '@/lib/scroll-animation';
import type { RefObject } from 'react';

type UseScrollHighwayViewportCapArgs = {
	viewportRef: RefObject<HTMLElement | null>;
	/** Travel axis is vertical (up/down). */
	vertical: boolean;
	/** Cross-axis design size when travel is horizontal (fixed strip height). */
	horizontalCrossPx: number;
};

export type ScrollHighwayViewportCap = {
	/** Along-axis size for vertical travel; unused for horizontal width (fluid). */
	verticalAlongPx: number;
	/** Cross-axis height when travel is horizontal. */
	horizontalCrossPx: number;
	/** Fixed travel spacing — never shrinks with the viewport. */
	pxPerMeasure: number;
};

function readViewportSize(): { width: number; height: number } {
	const vv = window.visualViewport;
	if (vv) {
		return { width: vv.width, height: vv.height };
	}
	return { width: window.innerWidth, height: window.innerHeight };
}

function measureCap(
	vertical: boolean,
	horizontalCrossPx: number,
): ScrollHighwayViewportCap {
	if (typeof window === 'undefined') {
		return {
			verticalAlongPx: HIGHWAY_VIEWPORT_ALONG_PX,
			horizontalCrossPx,
			pxPerMeasure: HIGHWAY_PX_PER_MEASURE,
		};
	}

	const view = readViewportSize();

	if (vertical) {
		const along =
			clampHighwayAlongSpan(
				HIGHWAY_VIEWPORT_ALONG_PX,
				view.height,
				view.height,
			) || HIGHWAY_VIEWPORT_ALONG_PX;
		return {
			verticalAlongPx: along,
			horizontalCrossPx,
			pxPerMeasure: HIGHWAY_PX_PER_MEASURE,
		};
	}

	const cross =
		clampHighwayAlongSpan(horizontalCrossPx, view.height, view.height) ||
		Math.min(horizontalCrossPx, view.height);

	return {
		verticalAlongPx: HIGHWAY_VIEWPORT_ALONG_PX,
		horizontalCrossPx: cross,
		pxPerMeasure: HIGHWAY_PX_PER_MEASURE,
	};
}

/**
 * Caps the highway box to the browser viewport without packing gems tighter.
 * Short screens show less lookahead; {@link HIGHWAY_PX_PER_MEASURE} stays fixed.
 */
export function useScrollHighwayViewportCap({
	viewportRef,
	vertical,
	horizontalCrossPx,
}: UseScrollHighwayViewportCapArgs): ScrollHighwayViewportCap {
	const [cap, setCap] = useState(() => measureCap(vertical, horizontalCrossPx));

	useLayoutEffect(() => {
		const node = viewportRef.current;
		if (!node) return;

		const commit = (next: ScrollHighwayViewportCap) => {
			setCap((prev) =>
				prev.verticalAlongPx === next.verticalAlongPx &&
				prev.horizontalCrossPx === next.horizontalCrossPx &&
				prev.pxPerMeasure === next.pxPerMeasure
					? prev
					: next,
			);
		};

		const update = () => {
			commit(measureCap(vertical, horizontalCrossPx));
		};

		update();

		const ro = new ResizeObserver(update);
		ro.observe(node);
		window.addEventListener('resize', update);
		window.visualViewport?.addEventListener('resize', update);

		return () => {
			ro.disconnect();
			window.removeEventListener('resize', update);
			window.visualViewport?.removeEventListener('resize', update);
		};
	}, [viewportRef, vertical, horizontalCrossPx]);

	return cap;
}
