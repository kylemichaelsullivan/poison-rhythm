import { Section } from '@/components/layout';
import { MeasureGrid } from '@/components/measures';
import type { RhythmMeasure } from '@/types/rhythm';

type PoisonSelectorProps = {
	poisonRhythm: RhythmMeasure | null;
};

export function PoisonSelector({ poisonRhythm }: PoisonSelectorProps) {
	return (
		<Section title='Poison Rhythm'>
			<div className='PoisonSelectorBody'>
				{poisonRhythm === null ? (
					<p className='border border-mid rounded-lg border-dashed text-mid text-center p-8'>
						Click <b>New</b> to start.
					</p>
				) : (
					<MeasureGrid measure={poisonRhythm} />
				)}
			</div>
		</Section>
	);
}
