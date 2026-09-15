import clsx from 'clsx';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureGrid } from '.';

type CurrentMeasureDisplayProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	highlight?: boolean;
	/** When true, cells follow metronome playback highlights. */
	playback?: boolean;
	hidden?: boolean;
	label?: string;
	/** When true, show `label` visually (e.g. Listening / Playing during demo mode). */
	labelVisible?: boolean;
	countingIn?: boolean;
};

export function CurrentMeasureDisplay({
	measure,
	richMeasure,
	highlight = false,
	playback = false,
	hidden = false,
	label,
	labelVisible = false,
	countingIn = false,
}: CurrentMeasureDisplayProps) {
	return (
		<div
			className={clsx(
				'CurrentMeasureDisplay w-full',
				highlight && 'ring-2 ring-primary/50 rounded-lg shadow-soft',
			)}
			data-counting-in={countingIn ? 'true' : 'false'}
		>
			{label ? (
				labelVisible ? (
					<output
						className='Caption mb-2 block px-1 text-sm text-dark'
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
			<MeasureGrid
				measure={measure}
				richMeasure={richMeasure}
				playback={playback}
				hidden={hidden}
			/>
		</div>
	);
}
