import EyeIcon from '@/assets/svg/eye.svg?react';
import { IconToggle } from './IconToggle';
import { SettingRow } from './SettingRow';

type PoisonVisibilityToggleProps = {
	/** When true, poison reference is always shown. When false, hide during playback. */
	visible: boolean;
	onChange?: (visible: boolean) => void;
	disabled?: boolean;
	/** Include the Settings-style “Visibility” label row. Default true. */
	showLabel?: boolean;
};

export function PoisonVisibilityToggle({
	visible,
	onChange,
	disabled = false,
	showLabel = true,
}: PoisonVisibilityToggleProps) {
	const actionLabel = visible ? 'Hide During Playback' : 'Always Show';

	const toggle = (
		<IconToggle
			label={`Poison Visibility: ${visible ? 'Visible' : 'Not Visible During Playback'}`}
			pressed={visible}
			pressedIcon={EyeIcon}
			unpressedIcon={EyeIcon}
			title={actionLabel}
			disabled={disabled}
			onPressedChange={onChange}
		/>
	);

	if (!showLabel) {
		return toggle;
	}

	return <SettingRow label='Visibility'>{toggle}</SettingRow>;
}
