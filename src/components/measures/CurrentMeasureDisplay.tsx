import clsx from 'clsx';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureGrid } from './MeasureGrid';
import type { MeasurePlaybackPhase } from './measure-phase-chrome';

export type { MeasurePlaybackPhase } from './measure-phase-chrome';

type CurrentMeasureDisplayProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	highlight?: boolean;
	/** When true, cells follow metronome playback highlights. */
	playback?: boolean;
	hidden?: boolean;
	/** Screen-reader live status (never shown visually). */
	label?: string;
	/** Visual playback phase for the live measure chrome. */
	phase?: MeasurePlaybackPhase;
};

export function CurrentMeasureDisplay({
	measure,
	richMeasure,
	highlight = false,
	playback = false,
	hidden = false,
	label,
	phase = 'idle',
}: CurrentMeasureDisplayProps) {
	const countingIn = phase === 'count-in';

	return (
		<div
			className={clsx(
				'CurrentMeasureDisplay w-full rounded-lg transition-[box-shadow,opacity] duration-200',
				highlight && phase === 'idle' && 'ring-2 ring-primary shadow-soft',
				countingIn && 'opacity-55',
			)}
			data-counting-in={countingIn ? 'true' : 'false'}
			data-playback-phase={phase}
		>
			{label ? (
				<output className='sr-only' aria-live='polite'>
					{label}
				</output>
			) : null}
			<MeasureGrid
				measure={measure}
				richMeasure={richMeasure}
				playback={playback}
				hidden={hidden}
				phase={phase}
			/>
		</div>
	);
}
