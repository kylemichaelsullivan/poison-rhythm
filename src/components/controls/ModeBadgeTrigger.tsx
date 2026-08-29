import { IconButton } from '@/components/ui';
import type { GameModeHudBadge } from '@/lib/settings-schema';
import { ModeBadge } from './ModeBadge';

type ModeBadgeTriggerProps = {
	badge: GameModeHudBadge;
	onClick: () => void;
};

export function ModeBadgeTrigger({ badge, onClick }: ModeBadgeTriggerProps) {
	return (
		<IconButton
			variant='bare'
			label={`Play Mode: ${badge.label}. Change Play Mode`}
			title='Change Play Mode'
			popup='dialog'
			onClick={onClick}
		>
			<ModeBadge badge={badge} />
		</IconButton>
	);
}
