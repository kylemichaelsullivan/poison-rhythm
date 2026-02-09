import { Section } from '@/components/layout';
import { MeasureGrid } from '@/components/measures';
import type { RhythmMeasure } from '@/types/rhythm';

type PoisonSectionProps = {
	poisonRhythm: RhythmMeasure | null;
};

export function PoisonSection({ poisonRhythm }: PoisonSectionProps) {
	return (
		<Section title='Poison Rhythm'>
			{poisonRhythm === null ? (
				<p className='border border-mid rounded-lg border-dashed bg-dark/50 text-white text-center p-8'>
					Click <b>New</b> to start.
				</p>
			) : (
				<MeasureGrid measure={poisonRhythm} />
			)}
		</Section>
	);
}
