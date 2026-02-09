import { Section } from '@/components/layout';
import type { RhythmMeasure } from '@/types/rhythm';
import { MeasureSlider } from './MeasureSlider';

type MeasuresSectionProps = {
	measures: RhythmMeasure[];
};

export function MeasuresSection({ measures }: MeasuresSectionProps) {
	return (
		<Section title="Measures">
			{measures.length === 0 ? (
				<p className='rounded-lg border border-dashed border-mid bg-dark/50 p-8 text-center text-mid'>
					Click <b>New</b> to start.
				</p>
			) : (
				<MeasureSlider measures={measures} />
			)}
		</Section>
	);
}
