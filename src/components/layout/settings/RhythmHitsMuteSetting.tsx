import { usePlaybackMute } from '@/contexts';
import { MuteToggle } from './MuteToggle';

/** Settings → Sound: rhythm-hit channel mute. */
export function RhythmHitsMuteSetting() {
	const { muted, setMuted } = usePlaybackMute('rhythm');

	return <MuteToggle label='Rhythm Hits' muted={muted} onChange={setMuted} />;
}
