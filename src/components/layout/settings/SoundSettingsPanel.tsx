import { MetronomeTempoSlider } from '@/components/layout/metronome/MetronomeTempoSlider';
import { useMetronome, usePlaybackPreferences } from '@/contexts';
import { EnableToggle } from './EnableToggle';
import { MuteToggle } from './MuteToggle';
import { SettingsGroup } from './SettingsGroup';

export function SoundSettingsPanel() {
	const { tempo, handleTempoChange } = useMetronome();
	const {
		muteMetronome,
		countInEnabled,
		muteRhythmSounds,
		setMuteMetronome,
		setCountInEnabled,
		setMuteRhythmSounds,
	} = usePlaybackPreferences();

	return (
		<>
			<SettingsGroup title='Tempo'>
				<MetronomeTempoSlider tempo={tempo} onTempoChange={handleTempoChange} />
			</SettingsGroup>

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
		</>
	);
}
