import type { ReactNode } from 'react';
import { sideGutterControlClassName } from '@/lib/control-classes';
import { CarouselNavButton } from './CarouselNavButton';

type CarouselNavButtonsProps = {
	children: ReactNode | ReactNode[];
	onPrev: () => void;
	onNext: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
};

/**
 * Prev/next sit in the page gutters beside the body column.
 * Below ~63rem (no lateral gutter), they drop to the bottom corners.
 */
export function CarouselNavButtons({
	children,
	onPrev,
	onNext,
	canGoPrev,
	canGoNext,
}: CarouselNavButtonsProps) {
	return (
		<div className='CarouselNavButtons relative w-full'>
			<div
				className={sideGutterControlClassName('start', {
					collapseBelowGutter: true,
				})}
			>
				<CarouselNavButton
					direction='prev'
					onClick={onPrev}
					disabled={!canGoPrev}
				/>
			</div>
			{children}
			<div
				className={sideGutterControlClassName('end', {
					collapseBelowGutter: true,
				})}
			>
				<CarouselNavButton
					direction='next'
					onClick={onNext}
					disabled={!canGoNext}
				/>
			</div>
		</div>
	);
}
