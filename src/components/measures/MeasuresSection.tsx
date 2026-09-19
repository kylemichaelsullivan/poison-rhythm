import { CarouselNavButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { useGame, useSettings } from '@/contexts';
import { useMeasureDisplayOptions } from '@/hooks/useMeasureDisplayOptions';
import { useMeasurePlaybackSync } from '@/hooks/useMeasurePlaybackSync';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay, MeasureSlider, ScrollHighway } from '.';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { MeasureHeightReserve } from './MeasureHeightReserve';
import { MeasuresSectionHeaderActions } from './MeasuresSectionHeaderActions';
import { NextMeasureToggle } from './NextMeasureToggle';

type MeasuresSectionProps = {
	onNewPoison: () => void;
	onOpenDisplayMode: () => void;
};

export function MeasuresSection({
	onNewPoison,
	onOpenDisplayMode,
}: MeasuresSectionProps) {
	const { measures } = useGame();
	const { settings } = useSettings();
	const display = useMeasureDisplayOptions();
	const showNext = settings.showNextMeasure;
	const showDisplayModeTrigger = isBucketTrainerMode(settings);
	const {
		safeIndex,
		displayMeasure,
		displayRich,
		nextDisplayMeasure,
		nextDisplayRich,
		demoBeforePlay,
		isDemoPass,
		isCountingIn,
		isMeasuresRunning,
		measuresLength,
		setCurrentIndex,
		scrollMode,
		scrollDirection,
	} = useMeasurePlaybackSync();

	const hasMeasures = measures.length > 0;

	const spacer = scrollMode ? (
		<MeasureCarouselChrome scroll={{ direction: scrollDirection }}>
			<ScrollHighway
				measures={[REST_MEASURE]}
				direction={scrollDirection}
				playbackActive={false}
				label={demoBeforePlay ? 'Playing' : undefined}
				labelVisible={demoBeforePlay}
			/>
		</MeasureCarouselChrome>
	) : (
		<MeasureCarouselChrome
			nextSlot={
				showNext ? (
					<div className='NextMeasurePreview w-full opacity-35'>
						<MeasureHeightReserve measure={REST_MEASURE} display={display} />
					</div>
				) : undefined
			}
		>
			<CurrentMeasureDisplay measure={REST_MEASURE} display={display} />
		</MeasureCarouselChrome>
	);

	return (
		<CarouselNavButtons
			onPrev={() => setCurrentIndex(Math.max(0, safeIndex - 1))}
			onNext={() =>
				setCurrentIndex(Math.min(measuresLength - 1, safeIndex + 1))
			}
			canGoPrev={hasMeasures && safeIndex > 0}
			canGoNext={hasMeasures && safeIndex < measuresLength - 1}
		>
			<Section
				title='Measures'
				headerLeading={scrollMode ? undefined : <NextMeasureToggle />}
				headerAction={
					<MeasuresSectionHeaderActions
						showDisplayModeTrigger={showDisplayModeTrigger}
						renderMode={display.renderMode}
						onOpenDisplayMode={onOpenDisplayMode}
					/>
				}
			>
				<StableContentFrame spacer={spacer}>
					{!hasMeasures || !displayMeasure ? (
						<EmptyStartPrompt onClick={onNewPoison} />
					) : (
						<MeasureSlider
							measures={measures}
							displayMeasure={displayMeasure}
							displayRich={displayRich}
							nextDisplayMeasure={nextDisplayMeasure}
							nextDisplayRich={nextDisplayRich}
							showNextMeasure={showNext}
							demoBeforePlay={demoBeforePlay}
							isDemoPass={isDemoPass}
							isCountingIn={isCountingIn}
							isMeasuresRunning={isMeasuresRunning}
							display={display}
							scrollMode={scrollMode}
							scrollDirection={scrollDirection}
						/>
					)}
				</StableContentFrame>
			</Section>
		</CarouselNavButtons>
	);
}
