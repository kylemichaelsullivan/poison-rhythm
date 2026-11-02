import { EnableToggle } from './EnableToggle';
import { useSetting } from './useSetting';
import type { SvgIconComponent } from '@/components/layout/Icon';
import type { GameSettings } from '@/lib/settings-schema';

type GameBooleanKey = {
	[K in keyof GameSettings]: GameSettings[K] extends boolean ? K : never;
}[keyof GameSettings];

type GameBooleanSettingProps = {
	setting: GameBooleanKey;
	label: string;
	icon?: SvgIconComponent;
};

/** Practice boolean from the game-settings blob. */
export function GameBooleanSetting({
	setting,
	label,
	icon,
}: GameBooleanSettingProps) {
	const [enabled, setEnabled] = useSetting(setting);

	return (
		<EnableToggle
			label={label}
			enabled={enabled}
			onChange={setEnabled}
			icon={icon}
		/>
	);
}
