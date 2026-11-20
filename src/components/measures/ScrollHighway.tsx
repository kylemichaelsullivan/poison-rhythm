import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import { useScrollHighwayTrack } from '@/hooks/useScrollHighwayTrack';
import { useScrollHighwayViewportCap } from '@/hooks/useScrollHighwayViewportCap';
import { dataBool } from '@/lib/data-attr';
import {
	collectHighwayBarLines,
	collectHighwayNotes,
	highwayNoteTrackInset,
	padMeasuresForHighwayLookahead,
} from '@/lib/scroll-animation';
import {
	SCROLL_HIGHWAY_BAR_ALONG_PX,
	ScrollHighwayBarLine,
} from './ScrollHighwayBarLine';
import {
	SCROLL_HIGHWAY_GEM_ALONG_PX,
	SCROLL_HIGHWAY_HORIZONTAL_VIEWPORT_PX,
	ScrollHighwayNote,
} from './ScrollHighwayNote';
import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';

type ScrollHighwayProps = {
	measures: RhythmMeasure[];
	/** Poison index in `measures`; −1 when poison is off. */
	poisonIndex?: number;
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
 * do not remount or flash while scrolling. Sized to stay within the browser
 * viewport (never taller or wider than the screen).
 */
export function ScrollHighway({
	measures,
	poisonIndex = -1,
	direction,
	playbackActive,
	countingIn = false,
	label,
	labelVisible = false,
}: ScrollHighwayProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);

	const vertical = isVertical(direction);
	const { verticalAlongPx, horizontalCrossPx, pxPerMeasure } =
		useScrollHighwayViewportCap({
			viewportRef,
			vertical,
			horizontalCrossPx: SCROLL_HIGHWAY_HORIZONTAL_VIEWPORT_PX,
		});

	useScrollHighwayTrack(
		{ trackRef, rootRef },
		playbackActive,
		direction,
		pxPerMeasure,
	);

	const gemAlongPx = SCROLL_HIGHWAY_GEM_ALONG_PX;
	const barAlongPx = SCROLL_HIGHWAY_BAR_ALONG_PX;

	const highwayMeasures = useMemo(
		() => padMeasuresForHighwayLookahead(measures, poisonIndex),
		[measures, poisonIndex],
	);

	// Stable lists — never filter by playhead or gems remount and flash.
	const notes = useMemo(
		() => collectHighwayNotes(highwayMeasures),
		[highwayMeasures],
	);
	const barLines = useMemo(
		() => collectHighwayBarLines(highwayMeasures.length),
		[highwayMeasures.length],
	);

	const viewportStyle = vertical
		? {
				height: `${verticalAlongPx}px`,
				width: '100%',
				maxWidth: '100%',
			}
		: {
				height: `${horizontalCrossPx}px`,
				width: '100%',
				maxWidth: '100%',
			};

	return (
		<div
			className='ScrollHighway flex w-full max-w-full min-w-0 flex-col gap-2'
			ref={rootRef}
			data-testid='scroll-highway'
			data-direction={direction}
			data-counting-in={dataBool(countingIn)}
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
				className='ScrollHighwayViewport relative w-full max-w-full overflow-hidden rounded-lg border-2 border-primary/30 bg-primary/5 shadow-soft'
				ref={viewportRef}
				style={viewportStyle}
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
					{barLines.map((bar) => {
						const inset = highwayNoteTrackInset(
							direction,
							bar.at,
							pxPerMeasure,
							barAlongPx,
						);
						return (
							<div
								className={clsx(
									'ScrollHighwayBarSlot pointer-events-none absolute',
									// Slightly wider than gems so downbeats read as measure structure.
									vertical && 'left-[5%] w-[90%]',
									!vertical && 'top-[5%] h-[90%]',
								)}
								style={inset}
								data-bar-id={bar.id}
								key={bar.id}
							>
								<ScrollHighwayBarLine vertical={vertical} />
							</div>
						);
					})}
					{notes.map((note) => {
						const inset = highwayNoteTrackInset(
							direction,
							note.at,
							pxPerMeasure,
							gemAlongPx,
						);
						return (
							<div
								className={clsx(
									'ScrollHighwayNoteSlot absolute',
									// 80% of the viewport cross-track; track is the % containing block.
									vertical && 'left-[10%] w-[80%]',
									!vertical && 'top-[10%] h-[80%]',
								)}
								style={inset}
								data-note-id={note.id}
								key={note.id}
							>
								<ScrollHighwayNote vertical={vertical} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
