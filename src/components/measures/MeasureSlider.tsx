import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import {
	CurrentMeasureDisplay,
	type MeasurePlaybackPhase,
} from './CurrentMeasureDisplay';
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
	isMeasuresRunning: boolean;
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
	displayMeasure,
	displayRich,
	nextDisplayMeasure,
	nextDisplayRich,
	showNextMeasure,
	demoBeforePlay,
	isDemoPass,
	isCountingIn,
	isMeasuresRunning,
}: MeasureSliderProps) {
	const phase = resolvePlaybackPhase({
		isCountingIn,
		isMeasuresRunning,
		demoBeforePlay,
		isDemoPass,
	});

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
				phase={phase}
				label={resolvePlaybackLabel({
					isCountingIn,
					demoBeforePlay,
					isDemoPass,
				})}
			/>
		</MeasureCarouselChrome>
	);
}
