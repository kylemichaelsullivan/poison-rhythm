import type { ReactNode } from 'react';
import { CarouselNavButton } from './CarouselNavButton';

type CarouselNavButtonsProps = {
	children: ReactNode | ReactNode[];
	onPrev: () => void;
	onNext: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
};

/** Prev/next controls sit in the page gutters outside the body column. */
export function CarouselNavButtons({
	children,
	onPrev,
	onNext,
	canGoPrev,
	canGoNext,
}: CarouselNavButtonsProps) {
	return (
		<div className='CarouselNavButtons relative w-full'>
			<div className='absolute top-1/2 right-full z-10 mr-3 -translate-y-1/2 max-[63rem]:right-auto max-[63rem]:left-2 max-[63rem]:mr-0'>
				<CarouselNavButton
					direction='prev'
					onClick={onPrev}
					disabled={!canGoPrev}
				/>
			</div>
			{children}
			<div className='absolute top-1/2 left-full z-10 ml-3 -translate-y-1/2 max-[63rem]:left-auto max-[63rem]:right-2 max-[63rem]:ml-0'>
				<CarouselNavButton
					direction='next'
					onClick={onNext}
					disabled={!canGoNext}
				/>
			</div>
		</div>
	);
}
