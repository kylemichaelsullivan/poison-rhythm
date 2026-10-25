import { EnableToggle } from './EnableToggle';
import type { ToggleSetting } from '@/lib/settings-schema';

type OnOffSettingProps = {
	label: string;
	value: ToggleSetting;
	onChange: (value: ToggleSetting) => void;
	disabled?: boolean;
};

export function OnOffSetting({
	label,
	value,
	onChange,
	disabled = false,
}: OnOffSettingProps) {
	return (
		<EnableToggle
			label={label}
			enabled={value === 'on'}
			disabled={disabled}
			onChange={(enabled) => onChange(enabled ? 'on' : 'off')}
		/>
	);
}
