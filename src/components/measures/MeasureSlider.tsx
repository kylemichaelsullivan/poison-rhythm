import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { NextMeasurePreview } from './NextMeasurePreview';
import { ScrollHighway } from './ScrollHighway';
import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import type { MeasurePlaybackPhase } from './CurrentMeasureDisplay';
import type { MeasureDisplayOptions } from './measure-display-options';

type MeasureSliderProps = {
	measures: RhythmMeasure[];
	/** Poison index for Scroll highway lookahead padding. */
	poisonIndex?: number;
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
	if (demoBeforePlay) {
		// Count-in leads into the demo pass; keep Listening until the student pass.
		if (isCountingIn || isDemoPass) return 'Listening';
		return 'Playing';
	}
	return 'Current Measure';
}

export function MeasureSlider({
	measures,
	poisonIndex = -1,
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
					poisonIndex={poisonIndex}
					direction={scrollDirection}
					playbackActive={isMeasuresRunning}
					countingIn={isCountingIn}
					label={label}
					labelVisible={demoBeforePlay}
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
