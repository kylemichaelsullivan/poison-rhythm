import type { RhythmMeasure } from '@/types';
import { MeasureCell } from '.';

type MeasureGridProps = {
	measure: RhythmMeasure;
	playback?: boolean;
};

export function MeasureGrid({ measure, playback = false }: MeasureGridProps) {
	return (
		<div className='MeasureGrid grid grid-cols-16 gap-1 w-full border border-mid rounded-lg p-2'>
			{measure.map((cell, i) => (
				<MeasureCell
					value={cell}
					playback={playback}
					index={i}
					key={`${i}-${cell}`}
				/>
			))}
		</div>
	);
}
