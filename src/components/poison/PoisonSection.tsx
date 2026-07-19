import type { Ref } from 'react';
import { ControlButtons } from '@/components/controls';
import { Section } from '@/components/layout';
import { MeasureGrid } from '@/components/measures';
import type { RhythmMeasure } from '@/types';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
	onNewPoison: () => void;
	onReusePoison: () => void;
	onReuseDisabledClick?: () => void;
	newButtonRef?: Ref<HTMLButtonElement>;
};

export function PoisonSection({
	poisonRhythm,
	onNewPoison,
	onReusePoison,
	onReuseDisabledClick,
	newButtonRef,
}: PoisonSectionProps) {
	return (
		<Section title='Poison Rhythm'>
			{poisonRhythm === null ? (
				<p className='border border-mid rounded-lg border-dashed bg-dark/50 text-white text-center p-8'>
					Click <b>New</b> to start.
				</p>
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
