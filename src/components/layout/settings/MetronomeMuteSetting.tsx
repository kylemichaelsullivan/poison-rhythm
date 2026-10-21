import { usePlaybackMute } from '@/contexts';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound: metronome channel mute. */
export function MetronomeMuteSetting() {
	const { muted, setMuted } = usePlaybackMute('metronome');

	return <MuteToggle label='Metronome' muted={muted} onChange={setMuted} />;
}
