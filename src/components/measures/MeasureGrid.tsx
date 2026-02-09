import type { RhythmMeasure } from '@/types/rhythm';
import { MeasureCell } from './MeasureCell';

type MeasureGridProps = {
	measure: RhythmMeasure;
};

export function MeasureGrid({ measure }: MeasureGridProps) {
	return (
		<div className='MeasureGrid grid grid-cols-16 gap-1 w-full'>
			{measure.map((cell, i) => (
				<MeasureCell value={cell} index={i} key={`${i}-${cell}`} />
			))}
		</div>
	);
}
