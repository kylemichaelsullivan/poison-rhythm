import clsx from 'clsx';
import type { ReactNode } from 'react';
import { scrollAnimationClass } from '@/lib/scroll-animation';
import type { ScrollDirection, ScrollSpeed } from '@/lib/settings-schema';

type MeasureCarouselChromeProps = {
	children: ReactNode;
	nextSlot?: ReactNode;
	/** When set, applies scroll animation and live slider test id. */
	scroll?: {
		direction: ScrollDirection;
		speed: ScrollSpeed;
	};
};

export function MeasureCarouselChrome({
	children,
	nextSlot,
	scroll,
}: MeasureCarouselChromeProps) {
	const scrollClass = scroll
		? scrollAnimationClass(scroll.direction, scroll.speed)
		: undefined;

	return (
		<div
			className={clsx(
				'MeasureCarouselChrome MeasureSlider flex flex-col items-center gap-3',
				scrollClass,
			)}
			data-testid={scroll ? 'measure-slider' : undefined}
		>
			{children}
			{nextSlot}
		</div>
	);
}
