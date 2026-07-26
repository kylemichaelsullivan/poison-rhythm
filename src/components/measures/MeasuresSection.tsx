import { EmptyStartPrompt, Section } from '@/components/layout';
import type { RhythmMeasure } from '@/types';
import { MeasureSlider } from '.';

type MeasuresSectionProps = {
	measures: RhythmMeasure[];
	poisonRhythm: RhythmMeasure | null;
	onEmptyClick?: () => void;
};

export function MeasuresSection({
	measures,
	poisonRhythm,
	onEmptyClick,
}: MeasuresSectionProps) {
	return (
		<Section title='Measures'>
			{measures.length === 0 ? (
				<EmptyStartPrompt onClick={onEmptyClick} />
			) : (
				<MeasureSlider measures={measures} poisonRhythm={poisonRhythm} />
			)}
		</Section>
	);
}
