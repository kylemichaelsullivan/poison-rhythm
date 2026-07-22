import { useTheme } from '@/contexts';
import { SoundSetting } from './SoundSetting';
import { ThemeSetting } from './ThemeSetting';

export function SettingsOverlay() {
	const {
		theme,
		setTheme,
		muteMetronome,
		muteRhythmSounds,
		setMuteMetronome,
		// setMuteRhythmSounds,
	} = useTheme();

	return (
		<div className='SettingsOverlay flex w-full flex-col gap-5'>
			<ThemeSetting value={theme} onChange={setTheme} />
			<SoundSetting
				muteMetronome={muteMetronome}
				muteRhythmSounds={muteRhythmSounds}
				onMuteMetronomeChange={setMuteMetronome}
				// onMuteRhythmSoundsChange={setMuteRhythmSounds}
				rhythmSoundsDisabled
			/>
		</div>
	);
}
