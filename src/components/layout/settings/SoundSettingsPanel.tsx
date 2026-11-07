import { MetronomeTempoSlider } from '@/components/layout/metronome/MetronomeTempoSlider';
import { useSettings } from '@/contexts';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import { CountInEnableSetting } from './CountInEnableSetting';
import { FeedbackToggles } from './FeedbackToggles';
import { MetronomeMuteSetting } from './MetronomeMuteSetting';
import { PlaybackMuteSetting } from './PlaybackMuteSetting';
import { PreviewMuteSetting } from './PreviewMuteSetting';
import { SettingsGroup } from './SettingsGroup';
import { When } from './When';

/** Settings → Sound. Each control binds its own global prefs / settings. */
export function SoundSettingsPanel() {
	const { settings } = useSettings();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);

	return (
		<>
			<SettingsGroup title='Feedback'>
				<FeedbackToggles />
			</SettingsGroup>

			<SettingsGroup title='Playback'>
				<MetronomeMuteSetting />
				<PlaybackMuteSetting />
				<When condition={!scrollMode}>
					<PreviewMuteSetting />
					<CountInEnableSetting />
				</When>
			</SettingsGroup>

			<SettingsGroup title='Tempo'>
				<MetronomeTempoSlider />
			</SettingsGroup>
		</>
	);
}
