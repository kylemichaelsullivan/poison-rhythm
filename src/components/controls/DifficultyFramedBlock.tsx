import { Section } from '@/components/layout';
import { useSettings } from '@/contexts';
import { resolveGameModeHudBadge } from '@/lib/settings-schema';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';
import { ModeBadgeTrigger } from './ModeBadgeTrigger';

type DifficultyFramedBlockProps = {
	onOpenHelp: () => void;
	onOpenPlayModes: () => void;
};

/** About-modal Difficulty section with play-mode badge. */
export function DifficultyFramedBlock({
	onOpenHelp,
	onOpenPlayModes,
}: DifficultyFramedBlockProps) {
	const { settings } = useSettings();
	const modeBadge = resolveGameModeHudBadge(settings);

	return (
		<Section
			title='Difficulty'
			headerLeading={
				<ModeBadgeTrigger badge={modeBadge} onClick={onOpenPlayModes} />
			}
			headerAction={<InfoGlyphButton onClick={onOpenHelp} />}
		>
			<DifficultySlider />
		</Section>
	);
}
