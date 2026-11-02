import { IconButton } from '@/components/ui';
import { ModeBadge } from './ModeBadge';
import type { GameModeHudBadge } from '@/lib/settings-schema';

type ModeBadgeTriggerProps = {
	badge: GameModeHudBadge;
	onClick: () => void;
};

export function ModeBadgeTrigger({ badge, onClick }: ModeBadgeTriggerProps) {
	return (
		<IconButton
			variant='bare'
			label={
				badge.endless && badge.tone !== 'bucket'
					? `Play Mode: ${badge.label}, Endless. Change Play Mode`
					: `Play Mode: ${badge.label}. Change Play Mode`
			}
			title={
				badge.endless && badge.tone !== 'bucket'
					? `Change Play Mode (${badge.label}, Endless)`
					: `Change Play Mode (${badge.label})`
			}
			popup='dialog'
			onClick={onClick}
		>
			<ModeBadge badge={badge} />
		</IconButton>
	);
}
