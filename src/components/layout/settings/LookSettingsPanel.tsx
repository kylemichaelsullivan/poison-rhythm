import { useTheme } from '@/contexts';
import { ColorAccentSettings } from './colors';
import { DisplayModeControls } from './DisplayModeControls';
import { FeedbackToggles } from './FeedbackToggles';
import { SettingsGroup } from './SettingsGroup';
import { ThemeSetting } from './ThemeSetting';
import { useUpdateSetting } from './useUpdateSetting';

/** Theme, display, feedback, and color accents — one Look tab. */
export function LookSettingsPanel() {
	const { theme, setTheme } = useTheme();
	const { settings, set } = useUpdateSetting();

	return (
		<>
			<SettingsGroup title='Theme'>
				<ThemeSetting value={theme} onChange={setTheme} />
			</SettingsGroup>

			<SettingsGroup title='Display'>
				<DisplayModeControls />
			</SettingsGroup>

			<SettingsGroup title='Feedback'>
				<FeedbackToggles
					value={settings.feedbackMode}
					onChange={(value) => set('feedbackMode', value)}
				/>
			</SettingsGroup>

			<ColorAccentSettings />
		</>
	);
}
