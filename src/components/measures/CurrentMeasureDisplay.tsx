import type { RhythmMeasure } from '@/types';
import { MeasureGrid } from '.';

type CurrentMeasureDisplayProps = {
	measure: RhythmMeasure;
	currentIndex: number;
	totalCount: number;
};

export function CurrentMeasureDisplay({
	measure,
	currentIndex,
	totalCount,
}: CurrentMeasureDisplayProps) {
	return (
		<div className='CurrentMeasureDisplay flex flex-col gap-1 items-center w-full'>
			<p className='text-sm text-mid tabular-nums'>
				Measure {currentIndex + 1} of {totalCount}
			</p>
			<MeasureGrid measure={measure} playback />
		</div>
	);
}
