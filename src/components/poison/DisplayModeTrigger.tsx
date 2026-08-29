import { IconButton } from '@/components/ui';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { DisplayModeBadge } from './DisplayModeBadge';

type DisplayModeTriggerProps = {
	renderMode: RhythmRenderMode;
	scrollEnabled: boolean;
	onClick: () => void;
};

export function DisplayModeTrigger({
	renderMode,
	scrollEnabled,
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
			<DisplayModeBadge renderMode={renderMode} scrollEnabled={scrollEnabled} />
		</IconButton>
	);
}
