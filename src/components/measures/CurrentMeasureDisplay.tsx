import type { RhythmMeasure } from '@/types/rhythm';
import { MeasureGrid } from './MeasureGrid';

type CurrentMeasureDisplayProps = {
	measure: RhythmMeasure;
	currentIndex: number;
	totalCount: number;
};

export function CurrentMeasureDisplay({ measure }: CurrentMeasureDisplayProps) {
	return (
		<div className='CurrentMeasureDisplay flex flex-col gap-1 items-center w-full'>
			<MeasureGrid measure={measure} />
		</div>
	);
}
