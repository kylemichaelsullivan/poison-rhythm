import EarIcon from '@/assets/svg/ear.svg?react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { useSettings } from '@/contexts';
import { PRACTICE_TOGGLE_LABELS } from '@/lib/settings-labels';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import { ConditionalSettingsGroup } from './ConditionalSettingsGroup';
import { DisplayModeControls } from './DisplayModeControls';
import { GameBooleanSetting } from './GameBooleanSetting';
import { IntroTutorialSetting } from './IntroTutorialSetting';
import { SettingRow } from './SettingRow';
import { SettingsGroup } from './SettingsGroup';

/** Settings → Mode. Display + practice bind globally inside their composers. */
export function GameSettingsPanel() {
	const { settings } = useSettings();
	const scrollMode = isScrollDisplayMode(settings.rhythmRenderMode);

	return (
		<>
			<SettingsGroup title='Display'>
				<DisplayModeControls />
			</SettingsGroup>

			<ConditionalSettingsGroup when={!scrollMode} title='Practice'>
				<GameBooleanSetting
					setting='showNextMeasure'
					label={PRACTICE_TOGGLE_LABELS.showNextMeasure}
					icon={EyeIcon}
				/>
				<GameBooleanSetting
					setting='demoBeforePlay'
					label={PRACTICE_TOGGLE_LABELS.demoBeforePlay}
					icon={EarIcon}
				/>
			</ConditionalSettingsGroup>

			<SettingsGroup title='Rhythm'>
				<SettingRow label='Accents'>
					<span className='text-sm italic text-muted'>Coming Soon</span>
				</SettingRow>
				<SettingRow label='Sticking'>
					<span className='text-sm italic text-muted'>Coming Soon</span>
				</SettingRow>
			</SettingsGroup>

			<SettingsGroup title='Help'>
				<IntroTutorialSetting />
			</SettingsGroup>
		</>
	);
}
