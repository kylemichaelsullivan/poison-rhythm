import clsx from 'clsx';
import type { ReactNode } from 'react';
import { scrollAnimationClass } from '@/lib/scroll-animation';
import type { ScrollDirection } from '@/lib/settings-schema';

type MeasureCarouselChromeProps = {
	children: ReactNode;
	nextSlot?: ReactNode;
	/** Marks the live measures carousel for e2e (`measure-slider`). */
	live?: boolean;
	/** When set, applies scroll highway class names. */
	scroll?: {
		direction: ScrollDirection;
	};
};

export function MeasureCarouselChrome({
	children,
	nextSlot,
	live = false,
	scroll,
}: MeasureCarouselChromeProps) {
	const scrollClass = scroll
		? scrollAnimationClass(scroll.direction)
		: undefined;

	return (
		<div
			className={clsx(
				'MeasureCarouselChrome MeasureSlider flex flex-col items-center gap-3',
				scrollClass,
			)}
			data-testid={live ? 'measure-slider' : undefined}
		>
			{children}
			{nextSlot}
		</div>
	);
}
