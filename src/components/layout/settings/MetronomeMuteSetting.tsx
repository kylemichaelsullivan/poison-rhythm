import { usePlaybackMute } from '@/contexts';
import { MUTE_CHANNEL_LABELS } from '@/lib/settings-labels';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound: metronome channel mute. */
export function MetronomeMuteSetting() {
	const { muted, setMuted } = usePlaybackMute('metronome');

	return (
		<MuteToggle
			label={MUTE_CHANNEL_LABELS.metronome}
			muted={muted}
			onChange={setMuted}
		/>
	);
}
