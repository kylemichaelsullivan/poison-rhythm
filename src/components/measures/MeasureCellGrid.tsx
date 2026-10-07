import clsx from 'clsx';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCell } from './MeasureCell';
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
	showSticking: boolean;
};

/** 16th-note grid layout (2×2 below `sm`, 4-col from `sm` up). */
export function MeasureCellGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	phase,
	showSticking,
}: MeasureCellGridProps) {
	const beats = [0, 1, 2, 3] as const;

	return (
		<div
			className={clsx(
				'MeasureCellGrid grid grid-cols-2 gap-2 w-full p-2 sm:grid-cols-4 sm:gap-2.5',
				measureShellClass(phase),
				showSticking && 'pb-4',
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
