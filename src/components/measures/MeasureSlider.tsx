import { useEffect, useState } from 'react';
import type { RhythmMeasure } from '@/types/rhythm';
import { CarouselNavButtons } from '../controls/CarouselNavButtons';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';

type MeasureSliderProps = {
	measures: RhythmMeasure[];
};

export function MeasureSlider({ measures }: MeasureSliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// When measures are replaced (e.g. after Reset), clamp index and reset to 0 so nav works
	useEffect(() => {
		if (measures.length === 0) {
			setCurrentIndex(0);
		} else if (currentIndex >= measures.length) {
			setCurrentIndex(0);
		}
	}, [measures.length, currentIndex]);

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
