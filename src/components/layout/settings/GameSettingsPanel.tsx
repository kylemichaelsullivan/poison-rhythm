import { DifficultyControls, PlayModeOptionList } from '@/components/controls';
import { Caption } from '@/components/ui';
import {
	isBucketTrainerMode,
	shouldShowMuteOnStudentPass,
} from '@/lib/settings-schema';
import { EnableToggle } from './EnableToggle';
import { PoisonVisibilityToggle } from './PoisonVisibilityToggle';
import { SettingsGroup } from './SettingsGroup';
import { SubdivisionSetting } from './SubdivisionSetting';
import { useUpdateSetting } from './useUpdateSetting';

export function GameSettingsPanel() {
	const { settings, set, updateSettings } = useUpdateSetting();
	const bucketMode = isBucketTrainerMode(settings);

	return (
		<>
			<SettingsGroup title='Play Mode'>
				<PlayModeOptionList
					selectedMode={settings.gameMode}
					endless={settings.endless}
					onSelect={(value) => set('gameMode', value)}
					onEndlessChange={(enabled) => set('endless', enabled)}
				/>
			</SettingsGroup>

			<SettingsGroup title='Complexity'>
				<DifficultyControls framed={false} />
				<SubdivisionSetting />
			</SettingsGroup>

			<SettingsGroup title='Practice'>
				<PoisonVisibilityToggle
					visible={settings.poisonMode === 'visible'}
					disabled={bucketMode}
					onChange={(visible) =>
						updateSettings({
							poisonMode: visible ? 'visible' : 'hidden',
						})
					}
				/>
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
				<Caption size='sm'>Accents and sticking Coming Soon.</Caption>
			</SettingsGroup>
		</>
	);
}
