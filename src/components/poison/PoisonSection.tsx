import { ControlButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { MeasureHeightReserve } from '@/components/measures';
import { useGame, useSettings } from '@/contexts';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import { PoisonMeasureContent } from './PoisonMeasureContent';
import { PoisonSectionHeader } from './PoisonSectionHeader';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
	onNewPoison: () => void;
	onReusePoison: () => void;
	onReuseDisabledClick?: () => void;
	onOpenDisplayMode: () => void;
};

export function PoisonSection({
	poisonRhythm,
	onNewPoison,
	onReusePoison,
	onReuseDisabledClick,
	onOpenDisplayMode,
}: PoisonSectionProps) {
	const { settings, updateSettings } = useSettings();
	const { round } = useGame();
	const bucketMode = isBucketTrainerMode(settings);

	return (
		<Section
			title='Poison Rhythm'
			headerLeading={
				<PoisonSectionHeader
					slot='leading'
					poisonVisible={settings.poisonMode === 'visible'}
					visibilityDisabled={bucketMode}
					onPoisonVisibleChange={(visible) =>
						updateSettings({
							poisonMode: visible ? 'visible' : 'hidden',
						})
					}
				/>
			}
			headerAction={
				<PoisonSectionHeader
					slot='action'
					renderMode={settings.rhythmRenderMode}
					onOpenDisplayMode={onOpenDisplayMode}
				/>
			}
		>
			<StableContentFrame
				spacer={<MeasureHeightReserve measure={REST_MEASURE} />}
			>
				{round === null ? (
					<EmptyStartPrompt onClick={onNewPoison} />
				) : (
					<PoisonMeasureContent poisonRhythm={poisonRhythm} />
				)}
			</StableContentFrame>
			<ControlButtons
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				reuseDisabled={round === null}
				onReuseDisabledClick={onReuseDisabledClick}
			/>
		</Section>
	);
}
