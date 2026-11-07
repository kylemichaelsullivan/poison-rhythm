import { ControlButtons } from '@/components/controls';
import {
	EmptyStartPrompt,
	Section,
	StableContentFrame,
} from '@/components/layout';
import { useMeasureDisplayOptions } from '@/hooks/useMeasureDisplayOptions';
import { REST_MEASURE } from '@/types';
import { PoisonMeasureContent } from './PoisonMeasureContent';
import { PoisonReferenceViews } from './PoisonReferenceViews';
import { PoisonSectionHeader } from './PoisonSectionHeader';
import type { RhythmMeasure } from '@/types';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
	hasRound: boolean;
	onNewPoison: () => void;
	onReusePoison: () => void;
	onReuseDisabledClick?: () => void;
	onOpenDisplayMode: () => void;
};

export function PoisonSection({
	poisonRhythm,
	hasRound,
	onNewPoison,
	onReusePoison,
	onReuseDisabledClick,
	onOpenDisplayMode,
}: PoisonSectionProps) {
	const display = useMeasureDisplayOptions();

	return (
		<Section
			title='Poison Rhythm'
			headerLeading={<PoisonSectionHeader slot='leading' />}
			headerAction={
				<PoisonSectionHeader
					slot='action'
					renderMode={display.renderMode}
					onOpenDisplayMode={onOpenDisplayMode}
				/>
			}
		>
			<StableContentFrame
				spacer={
					<PoisonReferenceViews measure={REST_MEASURE} display={display} />
				}
			>
				{!hasRound ? (
					<EmptyStartPrompt onClick={onNewPoison} />
				) : (
					<PoisonMeasureContent poisonRhythm={poisonRhythm} />
				)}
			</StableContentFrame>
			<ControlButtons
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				reuseDisabled={!hasRound}
				onReuseDisabledClick={onReuseDisabledClick}
			/>
		</Section>
	);
}
