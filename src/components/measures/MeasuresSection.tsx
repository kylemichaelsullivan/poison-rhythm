import { useState } from 'react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import {
	CarouselNavButtons,
	PlaybackVolumeButton,
} from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { IconToggle } from '@/components/layout/settings';
import { DisplayModeModal, DisplayModeTrigger } from '@/components/poison';
import { Row } from '@/components/ui';
import { useGame, useSettings } from '@/contexts';
import { useMeasurePlaybackSync } from '@/hooks/useMeasurePlaybackSync';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import { REST_MEASURE } from '@/types';
import { CurrentMeasureDisplay, MeasureSlider, ScrollHighway } from '.';
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
	const {
		safeIndex,
		displayMeasure,
		displayRich,
		nextDisplayMeasure,
		nextDisplayRich,
		demoBeforePlay,
		isDemoPass,
		isCountingIn,
		isMeasuresPlaying,
		isMeasuresRunning,
		measuresLength,
		setCurrentIndex,
		scrollMode,
		scrollDirection,
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

	const scrollSpacer = scrollMode ? (
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
					headerLeading={scrollMode ? undefined : nextMeasureToggle}
					headerAction={
						<Row gap='2' align='center'>
							<PlaybackVolumeButton />
							{bucketMode ? (
								<DisplayModeTrigger
									renderMode={settings.rhythmRenderMode}
									onClick={() => setDisplayOpen(true)}
								/>
							) : null}
						</Row>
					}
				>
					<StableContentFrame spacer={scrollSpacer}>
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
								isMeasuresPlaying={isMeasuresPlaying}
								isMeasuresRunning={isMeasuresRunning}
								scrollMode={scrollMode}
								scrollDirection={scrollDirection}
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
