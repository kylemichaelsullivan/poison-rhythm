import { useCallback } from 'react';
import { CarouselNavButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { useGame, useMetronome, useSettings } from '@/contexts';
import { useMeasureDisplayOptions } from '@/hooks/useMeasureDisplayOptions';
import { useMeasurePlaybackSync } from '@/hooks/useMeasurePlaybackSync';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay, MeasureSlider, ScrollHighway } from '.';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { MeasureHeightReserve } from './MeasureHeightReserve';
import { MeasuresPracticeToggles } from './MeasuresPracticeToggles';
import { MeasuresSectionHeaderActions } from './MeasuresSectionHeaderActions';

type MeasuresSectionProps = {
	onNewPoison: () => void;
	onReusePoison: () => void;
	onOpenDisplayMode: () => void;
};

export function MeasuresSection({
	onNewPoison,
	onReusePoison,
	onOpenDisplayMode,
}: MeasuresSectionProps) {
	const { measures, poisonIndex } = useGame();
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
	const { toggleMeasures } = useMetronome();

	const hasMeasures = measures.length > 0;
	const atFirst = hasMeasures && safeIndex === 0;
	const atLast = hasMeasures && safeIndex >= measuresLength - 1;
	const startPlay = useCallback(() => {
		toggleMeasures();
	}, [toggleMeasures]);

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
					<div className='NextMeasurePreview w-full'>
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
			onStartPlay={atFirst ? startPlay : undefined}
			isPlaying={isMeasuresRunning}
			onReuse={atLast ? onReusePoison : undefined}
			onNew={atLast ? onNewPoison : undefined}
			showSideNav={!scrollMode}
		>
			<Section
				title='Measures'
				headerLeading={scrollMode ? undefined : <MeasuresPracticeToggles />}
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
							poisonIndex={poisonIndex}
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
