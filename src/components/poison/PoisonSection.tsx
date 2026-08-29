import { useState } from 'react';
import { ControlButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { PoisonVisibilityToggle } from '@/components/layout/settings/PoisonVisibilityToggle';
import { MeasureHeightReserve } from '@/components/measures';
import { useGame, useSettings } from '@/contexts';
import { isBucketTrainerMode } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';
import { REST_MEASURE } from '@/types';
import { DisplayModeModal } from './DisplayModeModal';
import { DisplayModeTrigger } from './DisplayModeTrigger';
import { PoisonMeasureContent } from './PoisonMeasureContent';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
	onNewPoison: () => void;
	onReusePoison: () => void;
	onReuseDisabledClick?: () => void;
};

export function PoisonSection({
	poisonRhythm,
	onNewPoison,
	onReusePoison,
	onReuseDisabledClick,
}: PoisonSectionProps) {
	const { settings, updateSettings } = useSettings();
	const { round } = useGame();
	const [displayOpen, setDisplayOpen] = useState(false);
	const bucketMode = isBucketTrainerMode(settings);
	const scrollEnabled = settings.scrollDirection !== 'none';

	return (
		<>
			<Section
				title='Poison Rhythm'
				headerLeading={
					<PoisonVisibilityToggle
						visible={settings.poisonMode === 'visible'}
						showLabel={false}
						disabled={bucketMode}
						onChange={(visible) =>
							updateSettings({
								poisonMode: visible ? 'visible' : 'hidden',
							})
						}
					/>
				}
				headerAction={
					<DisplayModeTrigger
						renderMode={settings.rhythmRenderMode}
						scrollEnabled={scrollEnabled}
						onClick={() => setDisplayOpen(true)}
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

			<DisplayModeModal
				open={displayOpen}
				onClose={() => setDisplayOpen(false)}
			/>
		</>
	);
}
