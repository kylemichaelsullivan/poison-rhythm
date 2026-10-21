import type { GameSettings } from '@/lib/settings-schema';
import { EnableToggle } from './EnableToggle';
import { useSetting } from './useSetting';

type GameBooleanKey = {
	[K in keyof GameSettings]: GameSettings[K] extends boolean ? K : never;
}[keyof GameSettings];

type GameBooleanSettingProps = {
	setting: GameBooleanKey;
	label: string;
};

/**
 * Practice boolean from the game-settings blob.
 * `muteOnStudentPass` auto-disables when Preview Before Play is off.
 */
export function GameBooleanSetting({
	setting,
	label,
}: GameBooleanSettingProps) {
	const [enabled, setEnabled] = useSetting(setting);
	const [demoBeforePlay] = useSetting('demoBeforePlay');
	const disabled = setting === 'muteOnStudentPass' && !demoBeforePlay;

	return (
		<EnableToggle
			label={label}
			enabled={enabled}
			disabled={disabled}
			onChange={setEnabled}
		/>
	);
}
