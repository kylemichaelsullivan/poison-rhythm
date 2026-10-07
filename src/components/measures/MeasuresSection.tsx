import { CarouselNavButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { useGame, useSettings } from '@/contexts';
import { useMeasurePlaybackSync } from '@/hooks/useMeasurePlaybackSync';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay, MeasureSlider } from '.';
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
	const { settings, updateSettings } = useSettings();
	const bucketMode = isBucketTrainerMode(settings);
	const showNext = settings.showNextMeasure;
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
	} = useMeasurePlaybackSync();

	const hasMeasures = measures.length > 0;

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
				headerLeading={
					<NextMeasureToggle
						visible={showNext}
						onVisibleChange={(visible) =>
							updateSettings({ showNextMeasure: visible })
						}
					/>
				}
				headerAction={
					<MeasuresSectionHeaderActions
						showDisplayMode={bucketMode}
						renderMode={settings.rhythmRenderMode}
						onOpenDisplayMode={onOpenDisplayMode}
					/>
				}
			>
				<StableContentFrame
					spacer={
						<MeasureCarouselChrome
							nextSlot={
								showNext ? (
									<div className='NextMeasurePreview w-full opacity-35'>
										<MeasureHeightReserve measure={REST_MEASURE} />
									</div>
								) : undefined
							}
						>
							<CurrentMeasureDisplay measure={REST_MEASURE} highlight />
						</MeasureCarouselChrome>
					}
				>
					{!hasMeasures || !displayMeasure ? (
						<EmptyStartPrompt onClick={onNewPoison} />
					) : (
						<MeasureSlider
							displayMeasure={displayMeasure}
							displayRich={displayRich}
							nextDisplayMeasure={nextDisplayMeasure}
							nextDisplayRich={nextDisplayRich}
							showNextMeasure={showNext}
							demoBeforePlay={demoBeforePlay}
							isDemoPass={isDemoPass}
							isCountingIn={isCountingIn}
							isMeasuresRunning={isMeasuresRunning}
						/>
					)}
				</StableContentFrame>
			</Section>
		</CarouselNavButtons>
	);
}
