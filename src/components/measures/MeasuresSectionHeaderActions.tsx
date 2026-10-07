import { PlaybackVolumeButton } from '@/components/controls';
import { DisplayModeTrigger } from '@/components/poison';
import { Row } from '@/components/ui';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type MeasuresSectionHeaderActionsProps = {
	showDisplayMode: boolean;
	renderMode: RhythmRenderMode;
	onOpenDisplayMode: () => void;
};

/** Volume control plus optional Display Mode trigger for Measures. */
export function MeasuresSectionHeaderActions({
	showDisplayMode,
	renderMode,
	onOpenDisplayMode,
}: MeasuresSectionHeaderActionsProps) {
	return (
		<Row gap='2' align='center'>
			<PlaybackVolumeButton />
			{showDisplayMode ? (
				<DisplayModeTrigger
					renderMode={renderMode}
					onClick={onOpenDisplayMode}
				/>
			) : null}
		</Row>
	);
}
