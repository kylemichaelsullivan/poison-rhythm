import { PlaybackVolumeButton } from '@/components/controls';
import { DisplayModeTrigger } from '@/components/poison';
import { Row } from '@/components/ui';
import type { RhythmRenderMode } from '@/lib/settings-schema';

type MeasuresSectionHeaderActionsProps = {
	showDisplayModeTrigger: boolean;
	renderMode: RhythmRenderMode;
	onOpenDisplayMode: () => void;
};

/** Volume control plus Display Mode trigger in Bucket Drumming. */
export function MeasuresSectionHeaderActions({
	showDisplayModeTrigger,
	renderMode,
	onOpenDisplayMode,
}: MeasuresSectionHeaderActionsProps) {
	return (
		<Row gap='2' align='center'>
			<PlaybackVolumeButton />
			{showDisplayModeTrigger ? (
				<DisplayModeTrigger
					renderMode={renderMode}
					onClick={onOpenDisplayMode}
				/>
			) : null}
		</Row>
	);
}
