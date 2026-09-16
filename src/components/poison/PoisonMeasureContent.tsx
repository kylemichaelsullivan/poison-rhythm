import { MeasureGrid } from '@/components/measures';
import { useGame, useMetronome, useSettings } from '@/contexts';
import { shouldHidePoisonDuringPlayback } from '@/lib/rhythm/poison';
import { isPoisonEnabled } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import { PoisonMeasureFrame } from './PoisonMeasureFrame';

type PoisonMeasureContentProps = {
	poisonRhythm: RhythmMeasure | null;
};

export function PoisonMeasureContent({
	poisonRhythm,
}: PoisonMeasureContentProps) {
	const { settings, updateSettings } = useSettings();
	const { poisonMeasure, round } = useGame();
	const { isMeasuresPlaying, isDemoPass } = useMetronome();

	const poisonEnabled = isPoisonEnabled(settings);
	const hidePoisonReference =
		isMeasuresPlaying &&
		!isDemoPass &&
		shouldHidePoisonDuringPlayback(settings.poisonMode);
	const hasPoisonPattern =
		poisonEnabled && poisonRhythm !== null && settings.poisonMode !== 'off';

	if (round === null) {
		return null;
	}

	if (hasPoisonPattern && poisonRhythm !== null) {
		return (
			<PoisonMeasureFrame
				hidden={hidePoisonReference}
				hiddenLabel={hidePoisonReference ? 'Hidden During Playback' : undefined}
				onHiddenClick={
					hidePoisonReference
						? () => updateSettings({ poisonMode: 'visible' })
						: undefined
				}
			>
				<MeasureGrid
					measure={poisonRhythm}
					richMeasure={poisonMeasure ?? undefined}
				/>
			</PoisonMeasureFrame>
		);
	}

	return (
		<PoisonMeasureFrame hidden>
			<MeasureGrid measure={REST_MEASURE} />
		</PoisonMeasureFrame>
	);
}
