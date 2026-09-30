import clsx from 'clsx';
import type { ReactNode } from 'react';
import {
	sideGutterCollapsedReserveClassName,
	sideGutterControlClassName,
} from '@/lib/control-classes';
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
 * Below ~63rem (no lateral gutter), they drop under the section with
 * `sideGutterCollapsedReserveClassName` so they clear PlayControls.
 */
export function CarouselNavButtons({
	children,
	onPrev,
	onNext,
	canGoPrev,
	canGoNext,
}: CarouselNavButtonsProps) {
	return (
		<div
			className={clsx(
				'CarouselNavButtons relative w-full',
				sideGutterCollapsedReserveClassName,
			)}
		>
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
