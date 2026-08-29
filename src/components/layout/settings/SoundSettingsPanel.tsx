import { usePreferences } from '@/contexts';
import { EnableToggle } from './EnableToggle';
import { MuteToggle } from './MuteToggle';
import { SettingsGroup } from './SettingsGroup';

export function SoundSettingsPanel() {
	const {
		muteMetronome,
		countInEnabled,
		muteRhythmSounds,
		setMuteMetronome,
		setCountInEnabled,
		setMuteRhythmSounds,
	} = usePreferences();

	return (
		<SettingsGroup title='Playback'>
			<MuteToggle
				label='Metronome'
				muted={muteMetronome}
				onChange={setMuteMetronome}
			/>
			<MuteToggle
				label='Rhythm Hits'
				muted={muteRhythmSounds}
				onChange={setMuteRhythmSounds}
			/>
			<EnableToggle
				label='Count-In Before Play'
				enabled={countInEnabled}
				onChange={setCountInEnabled}
			/>
		</SettingsGroup>
	);
}
