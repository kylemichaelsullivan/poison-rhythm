import clsx from 'clsx';
import {
	sideGutterCollapsedReserveClassName,
	sideGutterControlClassName,
} from '@/lib/control-classes';
import { CarouselEndMenu } from './CarouselEndMenu';
import { CarouselNavButton } from './CarouselNavButton';
import { CarouselStartPlayButton } from './CarouselStartPlayButton';
import type { ReactNode } from 'react';

type CarouselNavButtonsProps = {
	children: ReactNode | ReactNode[];
	onPrev: () => void;
	onNext: () => void;
	canGoPrev: boolean;
	canGoNext: boolean;
	/** First-measure Play countdown. Omit when empty or not on the first bar. */
	onStartPlay?: () => void;
	isPlaying?: boolean;
	/** Last-measure Reuse (same as the reuse control). */
	onReuse?: () => void;
	/** Last-measure New (same as the + control). */
	onNew?: () => void;
};

/**
 * Prev/next sit in the page gutters beside the body column.
 * Below `--breakpoint-gutter` (no lateral gutter), they drop under the
 * section with `sideGutterCollapsedReserveClassName` so they clear PlayControls.
 * First measure: delayed Play. Last measure: New / Reuse / Play.
 */
export function CarouselNavButtons({
	children,
	onPrev,
	onNext,
	canGoPrev,
	canGoNext,
	onStartPlay,
	isPlaying = false,
	onReuse,
	onNew,
}: CarouselNavButtonsProps) {
	const showStartPlay = !canGoPrev && onStartPlay != null;
	const showEndMenu = !canGoNext && onReuse != null && onNew != null;

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
				{showStartPlay ? (
					<CarouselStartPlayButton
						onStart={onStartPlay}
						isPlaying={isPlaying}
					/>
				) : (
					<CarouselNavButton
						direction='prev'
						onClick={onPrev}
						disabled={!canGoPrev}
					/>
				)}
			</div>
			{children}
			<div
				className={sideGutterControlClassName('end', {
					collapseBelowGutter: true,
				})}
			>
				{showEndMenu ? (
					<CarouselEndMenu onReuse={onReuse} onNew={onNew} />
				) : (
					<CarouselNavButton
						direction='next'
						onClick={onNext}
						disabled={!canGoNext}
					/>
				)}
			</div>
		</div>
	);
}
