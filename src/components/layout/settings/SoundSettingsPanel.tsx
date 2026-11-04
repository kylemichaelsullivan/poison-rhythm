import { MetronomeTempoSlider } from '@/components/layout/metronome/MetronomeTempoSlider';
import { CountInEnableSetting } from './CountInEnableSetting';
import { FeedbackToggles } from './FeedbackToggles';
import { MetronomeMuteSetting } from './MetronomeMuteSetting';
import { PlaybackMuteSetting } from './PlaybackMuteSetting';
import { PreviewMuteSetting } from './PreviewMuteSetting';
import { SettingsGroup } from './SettingsGroup';

/** Settings → Sound. Each control binds its own global prefs / settings. */
export function SoundSettingsPanel() {
	return (
		<>
			<SettingsGroup title='Feedback'>
				<FeedbackToggles />
			</SettingsGroup>

			<SettingsGroup title='Playback'>
				<MetronomeMuteSetting />
				<PlaybackMuteSetting />
				<PreviewMuteSetting />
				<CountInEnableSetting />
			</SettingsGroup>

			<SettingsGroup title='Tempo'>
				<MetronomeTempoSlider />
			</SettingsGroup>
		</>
	);
}
