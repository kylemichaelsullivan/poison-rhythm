import clsx from 'clsx';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCell } from './MeasureCell';
import type { MeasureDisplayOptions } from './measure-display-options';
import {
	type MeasurePlaybackPhase,
	measureBeatGroupClass,
	measureShellClass,
} from './measure-phase-chrome';

type MeasureCellGridProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	playback?: boolean;
	hidden?: boolean;
	phase?: MeasurePlaybackPhase;
	display: MeasureDisplayOptions;
};

/**
 * Beat-group grid. Only sixteenths stack to 2×2 below `sm` (keeps four cells
 * per beat readable). Quarters / eighths stay four-across — their cells already
 * span wider, so stacking is unnecessary.
 */
export function MeasureCellGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	phase,
	display,
}: MeasureCellGridProps) {
	const beats = [0, 1, 2, 3] as const;
	const stackSixteenthsOnNarrow = display.subdivisionLevel === 'sixteenths';

	return (
		<div
			className={clsx(
				'MeasureCellGrid grid w-full gap-2 p-2 sm:gap-2.5',
				stackSixteenthsOnNarrow ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-4',
				measureShellClass(phase),
				display.showSticking && 'pb-4',
			)}
		>
			{beats.map((beat) => {
				const start = beat * 4;
				return (
					<div
						className={clsx(
							'MeasureBeatGroup grid grid-cols-4 gap-px overflow-hidden rounded-md p-px',
							measureBeatGroupClass(phase),
						)}
						data-beat={beat + 1}
						key={beat}
					>
						{measure.slice(start, start + 4).map((cell, offset) => {
							const i = start + offset;
							const step = richMeasure?.[i];
							return (
								<MeasureCell
									value={cell}
									playback={playback}
									index={i}
									accent={step?.accent}
									sticking={step?.sticking}
									hidden={hidden}
									phase={phase}
									subdivisionLevel={display.subdivisionLevel}
									showVisualFeedback={display.showVisualFeedback}
									showAccents={display.showAccents}
									showSticking={display.showSticking}
									isMeasuresPlaying={display.isMeasuresPlaying}
									subdivisionIndex={display.subdivisionIndex}
									key={`${i}-${cell}`}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
