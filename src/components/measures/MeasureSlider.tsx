import type { ScrollDirection, ScrollSpeed } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { NextMeasurePreview } from './NextMeasurePreview';

type MeasureSliderProps = {
	displayMeasure: RhythmMeasure;
	displayRich?: RichRhythmMeasure;
	nextDisplayMeasure: RhythmMeasure | null;
	nextDisplayRich?: RichRhythmMeasure;
	showNextMeasure: boolean;
	demoBeforePlay: boolean;
	isDemoPass: boolean;
	isCountingIn: boolean;
	scrollDirection: ScrollDirection;
	scrollSpeed: ScrollSpeed;
};

export function MeasureSlider({
	displayMeasure,
	displayRich,
	nextDisplayMeasure,
	nextDisplayRich,
	showNextMeasure,
	demoBeforePlay,
	isDemoPass,
	isCountingIn,
	scrollDirection,
	scrollSpeed,
}: MeasureSliderProps) {
	return (
		<MeasureCarouselChrome
			scroll={{ direction: scrollDirection, speed: scrollSpeed }}
			nextSlot={
				showNextMeasure ? (
					<NextMeasurePreview
						measure={nextDisplayMeasure ?? REST_MEASURE}
						richMeasure={nextDisplayRich}
					/>
				) : undefined
			}
		>
			<CurrentMeasureDisplay
				measure={displayMeasure}
				richMeasure={displayRich}
				highlight
				playback
				countingIn={isCountingIn}
				label={
					isCountingIn
						? 'Counting In'
						: demoBeforePlay
							? isDemoPass
								? 'Listening'
								: 'Playing'
							: 'Current Measure'
				}
				labelVisible={demoBeforePlay}
			/>
		</MeasureCarouselChrome>
	);
}
