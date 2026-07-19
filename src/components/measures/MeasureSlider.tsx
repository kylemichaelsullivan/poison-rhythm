import { useEffect, useState } from 'react';
import { CarouselNavButtons } from '@/components/controls';
import { useMetronome } from '@/contexts';
import type { RhythmMeasure } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';

type MeasureSliderProps = {
	measures: RhythmMeasure[];
};

export function MeasureSlider({ measures }: MeasureSliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const { isMeasuresRunning, isMeasuresPlaying, measureCycle, stop } =
		useMetronome();

	// When measures are replaced (e.g. after Reset), clamp index and reset to 0 so nav works
	useEffect(() => {
		if (measures.length === 0) {
			setCurrentIndex(0);
		} else if (currentIndex >= measures.length) {
			setCurrentIndex(0);
		}
	}, [measures.length, currentIndex]);

	// Play always restarts from the first measure
	useEffect(() => {
		if (isMeasuresRunning) {
			setCurrentIndex(0);
		}
	}, [isMeasuresRunning]);

	useEffect(() => {
		if (!isMeasuresPlaying || measureCycle === 0) {
			return;
		}

		setCurrentIndex((i) => {
			if (i >= measures.length - 1) {
				stop();
				return i;
			}
			return i + 1;
		});
	}, [measureCycle, isMeasuresPlaying, measures.length, stop]);

	const safeIndex =
		measures.length > 0 ? Math.min(currentIndex, measures.length - 1) : 0;
	const measure = measures[safeIndex];
	if (!measure) return null;

	return (
		<div className='MeasureSlider flex flex-col items-center gap-4'>
			<CarouselNavButtons
				onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
				onNext={() =>
					setCurrentIndex((i) => Math.min(measures.length - 1, i + 1))
				}
				canGoPrev={safeIndex > 0}
				canGoNext={safeIndex < measures.length - 1}
			>
				<CurrentMeasureDisplay
					measure={measure}
					currentIndex={safeIndex}
					totalCount={measures.length}
				/>
			</CarouselNavButtons>
		</div>
	);
}
