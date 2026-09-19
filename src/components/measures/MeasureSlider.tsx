import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { NextMeasurePreview } from './NextMeasurePreview';
import { ScrollHighway } from './ScrollHighway';

type MeasureSliderProps = {
	measures: RhythmMeasure[];
	displayMeasure: RhythmMeasure;
	displayRich?: RichRhythmMeasure;
	nextDisplayMeasure: RhythmMeasure | null;
	nextDisplayRich?: RichRhythmMeasure;
	showNextMeasure: boolean;
	demoBeforePlay: boolean;
	isDemoPass: boolean;
	isCountingIn: boolean;
	isMeasuresPlaying: boolean;
	isMeasuresRunning: boolean;
	scrollMode: boolean;
	scrollDirection: Exclude<ScrollDirection, 'none'>;
};

export function MeasureSlider({
	measures,
	displayMeasure,
	displayRich,
	nextDisplayMeasure,
	nextDisplayRich,
	showNextMeasure,
	demoBeforePlay,
	isDemoPass,
	isCountingIn,
	isMeasuresRunning,
	scrollMode,
	scrollDirection,
}: MeasureSliderProps) {
	const label = isCountingIn
		? 'Counting In'
		: demoBeforePlay
			? isDemoPass
				? 'Listening'
				: 'Playing'
			: 'Current Measure';

	if (scrollMode) {
		return (
			<MeasureCarouselChrome live scroll={{ direction: scrollDirection }}>
				<ScrollHighway
					measures={measures}
					direction={scrollDirection}
					playbackActive={isMeasuresRunning}
					countingIn={isCountingIn}
					label={label}
					labelVisible={demoBeforePlay || isCountingIn}
				/>
			</MeasureCarouselChrome>
		);
	}

	return (
		<MeasureCarouselChrome
			live
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
				label={label}
				labelVisible={demoBeforePlay}
			/>
		</MeasureCarouselChrome>
	);
}
