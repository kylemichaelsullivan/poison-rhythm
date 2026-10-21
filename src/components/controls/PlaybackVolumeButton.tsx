import FullVolumeIcon from '@/assets/svg/full-volume.svg?react';
import MuteIcon from '@/assets/svg/mute.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { usePlaybackMute } from '@/contexts';

/** Toggles rhythm-hit mute — same pref as Settings → Sound → Rhythm Hits. */
export function PlaybackVolumeButton() {
	const { muted, setMuted } = usePlaybackMute('rhythm');
	const actionLabel = muted ? 'Unmute' : 'Mute';

	return (
		<IconToggle
			label={`Rhythm Hits: ${actionLabel}`}
			pressed={muted}
			pressedIcon={MuteIcon}
			unpressedIcon={FullVolumeIcon}
			title={`Click to ${actionLabel} Rhythm Hits`}
			variant='header'
			grow={false}
			selectedWhenPressed={false}
			onPressedChange={setMuted}
		/>
	);
}
