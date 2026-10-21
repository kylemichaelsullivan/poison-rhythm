import { DisplayModeControls } from './DisplayModeControls';
import { GameBooleanSetting } from './GameBooleanSetting';
import { SettingRow } from './SettingRow';
import { SettingsGroup } from './SettingsGroup';

/** Settings → Mode. Display + practice bind globally inside their composers. */
export function GameSettingsPanel() {
	return (
		<>
			<SettingsGroup title='Display'>
				<DisplayModeControls />
			</SettingsGroup>

			<SettingsGroup title='Practice'>
				<GameBooleanSetting
					setting='showNextMeasure'
					label='Show Next Measure'
				/>
				<GameBooleanSetting
					setting='demoBeforePlay'
					label='Preview Before Play'
				/>
				<GameBooleanSetting
					setting='muteOnStudentPass'
					label='Mute on Playing Pass'
				/>
			</SettingsGroup>

			<SettingsGroup title='Rhythm'>
				<SettingRow label='Accents'>
					<span className='text-sm italic text-muted'>Coming Soon</span>
				</SettingRow>
				<SettingRow label='Sticking'>
					<span className='text-sm italic text-muted'>Coming Soon</span>
				</SettingRow>
			</SettingsGroup>
		</>
	);
}
