import { useTheme } from '@/contexts';
import { FeedbackToggles } from './FeedbackToggles';
import { SettingsGroup } from './SettingsGroup';
import { ThemeSetting } from './ThemeSetting';
import { useUpdateSetting } from './useUpdateSetting';

export function AppearanceSettingsPanel() {
	const { theme, setTheme } = useTheme();
	const { settings, set } = useUpdateSetting();

	return (
		<>
			<SettingsGroup title='Theme'>
				<ThemeSetting value={theme} onChange={setTheme} />
			</SettingsGroup>

			<SettingsGroup title='Feedback'>
				<FeedbackToggles
					value={settings.feedbackMode}
					onChange={(value) => set('feedbackMode', value)}
				/>
			</SettingsGroup>
		</>
	);
}
