import { IconButton } from '@/components/ui';
import { ModeBadge } from './ModeBadge';
import type { GameModeHudBadge } from '@/lib/settings-schema';

type ModeBadgeTriggerProps = {
	badge: GameModeHudBadge;
	onClick: () => void;
	/** Overrides the default Change Play Mode accessible name. */
	label?: string;
	title?: string;
};

function playModeLabel(badge: GameModeHudBadge): string {
	return badge.endless && badge.tone !== 'bucket'
		? `Play Mode: ${badge.label}, Endless. Change Play Mode`
		: `Play Mode: ${badge.label}. Change Play Mode`;
}

function playModeTitle(badge: GameModeHudBadge): string {
	return badge.endless && badge.tone !== 'bucket'
		? `Change Play Mode (${badge.label}, Endless)`
		: `Change Play Mode (${badge.label})`;
}

export function ModeBadgeTrigger({
	badge,
	onClick,
	label,
	title,
}: ModeBadgeTriggerProps) {
	return (
		<IconButton
			variant='circle'
			label={label ?? playModeLabel(badge)}
			title={title ?? playModeTitle(badge)}
			popup='dialog'
			onClick={onClick}
		>
			<ModeBadge badge={badge} />
		</IconButton>
	);
}
