import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import {
	CurrentMeasureDisplay,
	type MeasurePlaybackPhase,
} from './CurrentMeasureDisplay';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import type { MeasureDisplayOptions } from './measure-display-options';
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
	isMeasuresRunning: boolean;
	display: MeasureDisplayOptions;
	scrollMode: boolean;
	scrollDirection: Exclude<ScrollDirection, 'none'>;
};

function resolvePlaybackPhase({
	isCountingIn,
	isMeasuresRunning,
	demoBeforePlay,
	isDemoPass,
}: {
	isCountingIn: boolean;
	isMeasuresRunning: boolean;
	demoBeforePlay: boolean;
	isDemoPass: boolean;
}): MeasurePlaybackPhase {
	if (isCountingIn) return 'count-in';
	if (!isMeasuresRunning) return 'idle';
	if (demoBeforePlay && isDemoPass) return 'listening';
	return 'playing';
}

function resolvePlaybackLabel({
	isCountingIn,
	demoBeforePlay,
	isDemoPass,
}: {
	isCountingIn: boolean;
	demoBeforePlay: boolean;
	isDemoPass: boolean;
}): string {
	if (isCountingIn) return 'Counting In';
	if (demoBeforePlay) return isDemoPass ? 'Listening' : 'Playing';
	return 'Current Measure';
}

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
	display,
	scrollMode,
	scrollDirection,
}: MeasureSliderProps) {
	const phase = resolvePlaybackPhase({
		isCountingIn,
		isMeasuresRunning,
		demoBeforePlay,
		isDemoPass,
	});
	const label = resolvePlaybackLabel({
		isCountingIn,
		demoBeforePlay,
		isDemoPass,
	});

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
						display={display}
					/>
				) : undefined
			}
		>
			<CurrentMeasureDisplay
				measure={displayMeasure}
				richMeasure={displayRich}
				playback
				phase={phase}
				label={label}
				display={display}
			/>
		</MeasureCarouselChrome>
	);
}
