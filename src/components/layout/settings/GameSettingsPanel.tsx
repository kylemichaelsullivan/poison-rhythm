import { shouldShowMuteOnStudentPass } from '@/lib/settings-schema';
import { EnableToggle } from './EnableToggle';
import { SettingRow } from './SettingRow';
import { SettingsGroup } from './SettingsGroup';
import { useUpdateSetting } from './useUpdateSetting';

export function GameSettingsPanel() {
	const { settings, set } = useUpdateSetting();

	return (
		<>
			<SettingsGroup title='Practice'>
				<EnableToggle
					label='Show Next Measure'
					enabled={settings.showNextMeasure}
					onChange={(value) => set('showNextMeasure', value)}
				/>
				<EnableToggle
					label='Preview Before Play'
					enabled={settings.demoBeforePlay}
					onChange={(value) => set('demoBeforePlay', value)}
				/>
				<EnableToggle
					label='Mute on Playing Pass'
					enabled={settings.muteOnStudentPass}
					disabled={!shouldShowMuteOnStudentPass(settings)}
					onChange={(value) => set('muteOnStudentPass', value)}
				/>
			</SettingsGroup>

			<SettingsGroup title='Rhythm'>
				<SettingRow label='Accents'>
					<span className='text-sm text-muted'>Coming Soon</span>
				</SettingRow>
				<SettingRow label='Sticking'>
					<span className='text-sm text-muted'>Coming Soon</span>
				</SettingRow>
			</SettingsGroup>
		</>
	);
}
