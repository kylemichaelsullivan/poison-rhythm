import FullVolumeIcon from '@/assets/svg/full-volume.svg?react';
import MuteIcon from '@/assets/svg/mute.svg?react';
import { Icon } from '@/components/layout/Icon';
import { IconButton } from '@/components/ui';
import { usePlaybackMute } from '@/contexts';

/** Upper-left mute control on the tempo modal. */
export function MetronomeModalMuteButton() {
	const { muted, setMuted } = usePlaybackMute('metronome');
	const actionLabel = muted ? 'Unmute' : 'Mute';

	return (
		<IconButton
			variant='modalClose'
			label={`${actionLabel} Metronome`}
			title={`Click to ${actionLabel} Metronome`}
			onClick={() => setMuted(!muted)}
		>
			<Icon svg={muted ? MuteIcon : FullVolumeIcon} />
		</IconButton>
	);
}
