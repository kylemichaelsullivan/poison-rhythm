import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { useScrollHighwayTrack } from '@/hooks/useScrollHighwayTrack';
import {
	collectHighwayNotes,
	HIGHWAY_LOOKAHEAD_MEASURES,
	HIGHWAY_PX_PER_MEASURE,
	highwayNoteTrackInset,
} from '@/lib/scroll-animation';
import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';
import { SCROLL_HIGHWAY_GEM_PX, ScrollHighwayNote } from './ScrollHighwayNote';

type ScrollHighwayProps = {
	measures: RhythmMeasure[];
	direction: Exclude<ScrollDirection, 'none'>;
	/** True while measures playback is running (includes count-in). */
	playbackActive: boolean;
	countingIn?: boolean;
	label?: string;
	labelVisible?: boolean;
};

function isVertical(direction: Exclude<ScrollDirection, 'none'>): boolean {
	return direction === 'up' || direction === 'down';
}

/**
 * Guitar Hero–style note highway: stable gems on a DOM-driven track so notes
 * do not remount or flash while scrolling.
 */
export function ScrollHighway({
	measures,
	direction,
	playbackActive,
	countingIn = false,
	label,
	labelVisible = false,
}: ScrollHighwayProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	useScrollHighwayTrack({ trackRef, rootRef }, playbackActive, direction);

	const vertical = isVertical(direction);
	const pxPerMeasure = HIGHWAY_PX_PER_MEASURE;
	const viewportSpan = (HIGHWAY_LOOKAHEAD_MEASURES + 0.5) * pxPerMeasure;
	const gemPx = SCROLL_HIGHWAY_GEM_PX;

	// Stable list — never filter by playhead or gems remount and flash.
	const notes = useMemo(() => collectHighwayNotes(measures), [measures]);

	return (
		<div
			className='ScrollHighway flex w-full flex-col gap-2'
			ref={rootRef}
			data-testid='scroll-highway'
			data-direction={direction}
			data-counting-in={countingIn ? 'true' : 'false'}
			data-progress='0.000'
		>
			{label ? (
				labelVisible ? (
					<output
						className='Caption block px-1 text-sm text-dark'
						aria-live='polite'
					>
						{label}
					</output>
				) : (
					<output className='sr-only' aria-live='polite'>
						{label}
					</output>
				)
			) : null}

			<div
				className='ScrollHighwayViewport relative w-full overflow-hidden rounded-lg border-2 border-primary/30 bg-primary/5 shadow-soft'
				style={
					vertical
						? { height: `${viewportSpan}px` }
						: { height: `${gemPx * 4}px` }
				}
			>
				<div
					className={clsx(
						'ScrollHighwayRail pointer-events-none absolute bg-mid',
						vertical
							? 'bottom-0 left-1/2 top-0 w-1 -translate-x-1/2'
							: 'left-0 right-0 top-1/2 h-1 -translate-y-1/2',
					)}
					aria-hidden='true'
				/>

				<div
					className={clsx(
						'ScrollHighwayJudgment pointer-events-none absolute z-10 border-secondary',
						direction === 'down' && 'inset-x-0 bottom-0 border-b-4',
						direction === 'up' && 'inset-x-0 top-0 border-t-4',
						direction === 'right' && 'inset-y-0 right-0 border-r-4',
						direction === 'left' && 'inset-y-0 left-0 border-l-4',
					)}
					aria-hidden='true'
				/>

				<div
					className={clsx(
						'ScrollHighwayTrack absolute will-change-transform',
						vertical ? 'inset-x-0 bottom-0 top-0' : 'inset-y-0 left-0 right-0',
					)}
					ref={trackRef}
					data-testid='scroll-highway-track'
				>
					{notes.map((note) => {
						const inset = highwayNoteTrackInset(
							direction,
							note.at,
							pxPerMeasure,
							gemPx,
						);
						return (
							<div
								className={clsx(
									'ScrollHighwayNoteSlot absolute',
									vertical && 'left-1/2 -translate-x-1/2',
									!vertical && 'top-1/2 -translate-y-1/2',
								)}
								style={inset}
								data-note-id={note.id}
								key={note.id}
							>
								<ScrollHighwayNote />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
