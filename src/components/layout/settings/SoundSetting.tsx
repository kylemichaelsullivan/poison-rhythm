import { MuteToggle } from './MuteToggle';
import { SettingsSection } from './SettingsSection';

type SoundSettingProps = {
	muteMetronome: boolean;
	onMuteMetronomeChange: (muted: boolean) => void;
	muteRhythmSounds: boolean;
	onMuteRhythmSoundsChange?: (muted: boolean) => void;
	rhythmSoundsDisabled?: boolean;
};

export function SoundSetting({
	muteMetronome,
	muteRhythmSounds,
	rhythmSoundsDisabled = false,
	onMuteMetronomeChange,
	onMuteRhythmSoundsChange,
}: SoundSettingProps) {
	return (
		<SettingsSection title='Sound'>
			<MuteToggle
				label='Metronome'
				muted={muteMetronome}
				onChange={onMuteMetronomeChange}
			/>
			<MuteToggle
				label='Rhythm Sounds'
				muted={muteRhythmSounds}
				onChange={onMuteRhythmSoundsChange}
				disabled={rhythmSoundsDisabled}
			/>
		</SettingsSection>
	);
}
