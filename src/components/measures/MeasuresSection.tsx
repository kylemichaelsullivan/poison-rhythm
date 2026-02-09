import { Section } from '@/components/layout';
import type { RhythmMeasure } from '@/types/rhythm';
import { MeasureSlider } from './MeasureSlider';

type MeasuresSectionProps = {
	measures: RhythmMeasure[];
};

export function MeasuresSection({ measures }: MeasuresSectionProps) {
	return (
		<Section title='Measures'>
			{measures.length === 0 ? (
				<p className='border border-mid rounded-lg border-dashed bg-dark/50 text-white text-center p-8'>
					Click <b>New</b> to start.
				</p>
			) : (
				<MeasureSlider measures={measures} />
			)}
		</Section>
	);
}
