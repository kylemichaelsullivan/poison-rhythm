import { Section } from '@/components/layout';
import { useSettings } from '@/contexts';
import { type GameModeHudBadge, gameModeHudBadge } from '@/lib/settings-schema';
import { DifficultySlider } from './DifficultySlider';
import { InfoGlyphButton } from './InfoGlyphButton';
import { ModeBadgeTrigger } from './ModeBadgeTrigger';

const POISON_BADGE: GameModeHudBadge = {
	label: 'Poison',
	tone: 'classic',
	endless: false,
};

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
	const modeBadge = gameModeHudBadge(settings) ?? POISON_BADGE;

	return (
		<Section
			title='Difficulty'
			titleSide='end'
			headerLeading={
				<ModeBadgeTrigger badge={modeBadge} onClick={onOpenPlayModes} />
			}
			headerAction={<InfoGlyphButton onClick={onOpenHelp} />}
		>
			<DifficultySlider />
		</Section>
	);
}
