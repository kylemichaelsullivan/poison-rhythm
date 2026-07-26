import { useEffect, useState } from 'react';
import { CarouselNavButtons } from '@/components/controls';
import { useMetronome } from '@/contexts';
import { rhythmsEqual } from '@/lib';
import type { RhythmMeasure } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';

type MeasureSliderProps = {
	measures: RhythmMeasure[];
	poisonRhythm: RhythmMeasure | null;
};

export function MeasureSlider({ measures, poisonRhythm }: MeasureSliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const {
		isMeasuresRunning,
		isMeasuresPlaying,
		measureCycle,
		setPlaybackMeasure,
		stop,
	} = useMetronome();

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
			const completedMeasure = measures[i];
			if (
				poisonRhythm &&
				completedMeasure &&
				rhythmsEqual(completedMeasure, poisonRhythm)
			) {
				stop();
				return i;
			}

			if (i >= measures.length - 1) {
				stop();
				return i;
			}
			return i + 1;
		});
	}, [
		measureCycle,
		isMeasuresPlaying,
		measures,
		poisonRhythm,
		stop,
	]);

	const safeIndex =
		measures.length > 0 ? Math.min(currentIndex, measures.length - 1) : 0;
	const measure = measures[safeIndex];

	useEffect(() => {
		setPlaybackMeasure(measure ?? null);
		return () => setPlaybackMeasure(null);
	}, [measure, setPlaybackMeasure]);
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
				<CurrentMeasureDisplay measure={measure} />
			</CarouselNavButtons>
		</div>
	);
}
