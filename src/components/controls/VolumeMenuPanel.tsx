import clsx from 'clsx';
import {
	MetronomeMuteSetting,
	PlaybackMuteSetting,
	PreviewMuteSetting,
	When,
} from '@/components/layout/settings';
import { Stack } from '@/components/ui';
import { useSettings } from '@/contexts';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
import { isScrollDisplayMode } from '@/lib/settings-schema';

type VolumeMenuPanelProps = {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
};

/** Hover/pin panel with Metronome, Playback and Preview mute rows. */
export function VolumeMenuPanel({
	onMouseEnter,
	onMouseLeave,
}: VolumeMenuPanelProps) {
	const { settings } = useSettings();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);

	return (
		<div
			className={clsx(
				'VolumeMenuPanel absolute right-0 top-full z-30 w-56 max-w-[calc(100vw-2rem)] translate-y-1 px-3 py-3',
				controlSurfaceBaseClassName,
			)}
			role='dialog'
			aria-label='Volume'
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<Stack gap='3'>
				<MetronomeMuteSetting />
				<PlaybackMuteSetting />
				<When condition={!scrollMode}>
					<PreviewMuteSetting />
				</When>
			</Stack>
		</div>
	);
}
