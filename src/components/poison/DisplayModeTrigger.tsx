import { IconButton } from '@/components/ui';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { DisplayModeBadge } from './DisplayModeBadge';

type DisplayModeTriggerProps = {
	renderMode: RhythmRenderMode;
	/** Opens Body-owned DisplayModeModal (local disclosure — not global). */
	onClick: () => void;
};

/** Badge shows `renderMode`; open handler stays local. */
export function DisplayModeTrigger({
	renderMode,
	onClick,
}: DisplayModeTriggerProps) {
	return (
		<IconButton
			variant='bare'
			label='Change Display Mode'
			title='Display Mode'
			popup='dialog'
			onClick={onClick}
		>
			<DisplayModeBadge renderMode={renderMode} />
		</IconButton>
	);
}
