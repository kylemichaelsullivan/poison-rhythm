import type { Ref } from 'react';
import { ControlButtons } from '@/components/controls';
import { EmptyStartPrompt, Section } from '@/components/layout';
import { MeasureGrid } from '@/components/measures';
import type { RhythmMeasure } from '@/types';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
	onNewPoison: () => void;
	onReusePoison: () => void;
	onReuseDisabledClick?: () => void;
	onEmptyClick?: () => void;
	newButtonRef?: Ref<HTMLButtonElement>;
};

export function PoisonSection({
	poisonRhythm,
	onNewPoison,
	onReusePoison,
	onReuseDisabledClick,
	onEmptyClick,
	newButtonRef,
}: PoisonSectionProps) {
	return (
		<Section title='Poison Rhythm'>
			{poisonRhythm === null ? (
				<EmptyStartPrompt onClick={onEmptyClick} />
			) : (
				<MeasureGrid measure={poisonRhythm} />
			)}
			<ControlButtons
				onNewPoison={onNewPoison}
				onReusePoison={onReusePoison}
				reuseDisabled={poisonRhythm === null}
				onReuseDisabledClick={onReuseDisabledClick}
				newButtonRef={newButtonRef}
			/>
		</Section>
	);
}
