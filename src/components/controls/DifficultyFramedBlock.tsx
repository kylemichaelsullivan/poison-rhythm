import { Section } from '@/components/layout';
import type { GameModeHudBadge } from '@/lib/settings-schema';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';
import { ModeBadgeTrigger } from './ModeBadgeTrigger';

type DifficultyFramedBlockProps = {
	sliderValue: number;
	onDifficultyChange: (next: number) => void;
	modeBadge: GameModeHudBadge;
	onOpenHelp: () => void;
	onOpenPlayModes: () => void;
};

/** About-modal Difficulty section with play-mode badge. */
export function DifficultyFramedBlock({
	sliderValue,
	onDifficultyChange,
	modeBadge,
	onOpenHelp,
	onOpenPlayModes,
}: DifficultyFramedBlockProps) {
	return (
		<Section
			title='Difficulty'
			titleSide='end'
			headerLeading={
				<ModeBadgeTrigger badge={modeBadge} onClick={onOpenPlayModes} />
			}
			headerAction={<InfoGlyphButton onClick={onOpenHelp} />}
		>
			<DifficultySlider value={sliderValue} onChange={onDifficultyChange} />
		</Section>
	);
}
