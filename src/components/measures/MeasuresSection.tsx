import { useState } from 'react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { CarouselNavButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { IconToggle } from '@/components/layout/settings';
import { DisplayModeModal, DisplayModeTrigger } from '@/components/poison';
import { useGame, useSettings } from '@/contexts';
import { useMeasurePlaybackSync } from '@/hooks/useMeasurePlaybackSync';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay, MeasureSlider } from '.';
import { MeasureCarouselChrome } from './MeasureCarouselChrome';
import { MeasureHeightReserve } from './MeasureHeightReserve';

type MeasuresSectionProps = {
	onNewPoison: () => void;
};

export function MeasuresSection({ onNewPoison }: MeasuresSectionProps) {
	const { measures } = useGame();
	const { settings, updateSettings } = useSettings();
	const [displayOpen, setDisplayOpen] = useState(false);
	const bucketMode = isBucketTrainerMode(settings);
	const showNext = settings.showNextMeasure;
	const scrollEnabled = settings.scrollDirection !== 'none';
	const {
		safeIndex,
		displayMeasure,
		displayRich,
		nextDisplayMeasure,
		nextDisplayRich,
		demoBeforePlay,
		isDemoPass,
		isCountingIn,
		measuresLength,
		setCurrentIndex,
		scrollDirection,
		scrollSpeed,
	} = useMeasurePlaybackSync();

	const hasMeasures = measures.length > 0;

	const nextMeasureToggle = (
		<IconToggle
			label={
				showNext
					? 'Next Measure Preview: Visible'
					: 'Next Measure Preview: Hidden'
			}
			title={showNext ? 'Hide Next Measure' : 'Show Next Measure'}
			pressed={showNext}
			pressedIcon={EyeIcon}
			unpressedIcon={EyeIcon}
			variant='header'
			grow={false}
			onPressedChange={(visible) =>
				updateSettings({ showNextMeasure: visible })
			}
		/>
	);

	return (
		<>
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
					headerLeading={nextMeasureToggle}
					headerAction={
						bucketMode ? (
							<DisplayModeTrigger
								renderMode={settings.rhythmRenderMode}
								scrollEnabled={scrollEnabled}
								onClick={() => setDisplayOpen(true)}
							/>
						) : undefined
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
								<CurrentMeasureDisplay
									measure={REST_MEASURE}
									label={demoBeforePlay ? 'Playing' : undefined}
									labelVisible={demoBeforePlay}
								/>
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
								scrollDirection={scrollDirection}
								scrollSpeed={scrollSpeed}
							/>
						)}
					</StableContentFrame>
				</Section>
			</CarouselNavButtons>

			{bucketMode ? (
				<DisplayModeModal
					open={displayOpen}
					onClose={() => setDisplayOpen(false)}
				/>
			) : null}
		</>
	);
}
