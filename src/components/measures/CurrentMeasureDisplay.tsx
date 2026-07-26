import type { RhythmMeasure } from '@/types';
import { MeasureGrid } from '.';

type CurrentMeasureDisplayProps = {
	measure: RhythmMeasure;
};

export function CurrentMeasureDisplay({ measure }: CurrentMeasureDisplayProps) {
	return (
		<div className='CurrentMeasureDisplay w-full'>
			<MeasureGrid measure={measure} playback />
		</div>
	);
}
