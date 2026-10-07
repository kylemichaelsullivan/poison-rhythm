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
			headerLeading={<InfoGlyphButton onClick={onOpenHelp} />}
			headerAction={
				<ModeBadgeTrigger badge={modeBadge} onClick={onOpenPlayModes} />
			}
		>
			<DifficultySlider value={sliderValue} onChange={onDifficultyChange} />
		</Section>
	);
}
