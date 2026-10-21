import { MetronomeTempoSlider } from '@/components/layout/metronome/MetronomeTempoSlider';
import { CountInEnableSetting } from './CountInEnableSetting';
import { FeedbackToggles } from './FeedbackToggles';
import { MetronomeMuteSetting } from './MetronomeMuteSetting';
import { RhythmHitsMuteSetting } from './RhythmHitsMuteSetting';
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
				<RhythmHitsMuteSetting />
				<CountInEnableSetting />
			</SettingsGroup>

			<SettingsGroup title='Tempo'>
				<MetronomeTempoSlider />
			</SettingsGroup>
		</>
	);
}
