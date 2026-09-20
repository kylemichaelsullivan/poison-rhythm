import clsx from 'clsx';
import type { ReactNode } from 'react';

type MeasureCarouselChromeProps = {
	children: ReactNode;
	nextSlot?: ReactNode;
	/** Live slider (not layout spacer) — sets the e2e test id. */
	live?: boolean;
};

export function MeasureCarouselChrome({
	children,
	nextSlot,
	live = false,
}: MeasureCarouselChromeProps) {
	return (
		<div
			className={clsx(
				'MeasureCarouselChrome MeasureSlider flex flex-col items-center gap-3',
			)}
			data-testid={live ? 'measure-slider' : undefined}
		>
			{children}
			{nextSlot}
		</div>
	);
}
