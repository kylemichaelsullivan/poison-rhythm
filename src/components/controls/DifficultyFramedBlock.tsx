import { Section } from '@/components/layout';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';

type DifficultyFramedBlockProps = {
	onOpenHelp: () => void;
};

/** About-modal Difficulty section (slider only — play mode is separate). */
export function DifficultyFramedBlock({
	onOpenHelp,
}: DifficultyFramedBlockProps) {
	return (
		<Section
			title='Difficulty'
			headerAction={<InfoGlyphButton onClick={onOpenHelp} />}
		>
			<DifficultySlider />
		</Section>
	);
}
