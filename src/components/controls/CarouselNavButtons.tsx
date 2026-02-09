import type { ReactNode } from 'react';
import { CarouselNavButton } from './CarouselNavButton';

type CarouselNavButtonsProps = {
	children: ReactNode | ReactNode[];
	onPrev: () => void;
	onNext: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
};

export function CarouselNavButtons({
	children,
	onPrev,
	onNext,
	canGoPrev,
	canGoNext,
}: CarouselNavButtonsProps) {
	return (
		<div className='CarouselNavButtons flex w-full items-center justify-center gap-4'>
			<CarouselNavButton
				direction='prev'
				onClick={onPrev}
				disabled={!canGoPrev}
			/>
			{children}
			<CarouselNavButton
				direction='next'
				onClick={onNext}
				disabled={!canGoNext}
			/>
		</div>
	);
}
