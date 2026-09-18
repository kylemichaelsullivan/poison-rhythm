import FullVolumeIcon from '@/assets/svg/full-volume.svg?react';
import MuteIcon from '@/assets/svg/mute.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { usePlaybackPreferences } from '@/contexts';

/** Toggles rhythm-hit mute — same pref as Settings → Sound → Rhythm Hits. */
export function PlaybackVolumeButton() {
	const { muteRhythmSounds, setMuteRhythmSounds } = usePlaybackPreferences();
	const actionLabel = muteRhythmSounds ? 'Unmute' : 'Mute';

	return (
		<IconToggle
			label={`Rhythm Hits: ${actionLabel}`}
			pressed={muteRhythmSounds}
			pressedIcon={MuteIcon}
			unpressedIcon={FullVolumeIcon}
			title={`Click to ${actionLabel} Rhythm Hits`}
			variant='header'
			grow={false}
			selectedWhenPressed={false}
			onPressedChange={setMuteRhythmSounds}
		/>
	);
}
