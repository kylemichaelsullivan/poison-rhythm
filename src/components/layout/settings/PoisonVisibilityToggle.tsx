import EyeIcon from '@/assets/svg/eye.svg?react';
import { EnableToggle } from './EnableToggle';
import { IconToggle } from './IconToggle';

type PoisonVisibilityToggleProps = {
	/** When true, poison reference is always shown. When false, hide during playback. */
	visible: boolean;
	onChange?: (visible: boolean) => void;
	disabled?: boolean;
	/**
	 * Settings row with “Show Poison?” checkbox when true (default).
	 * Header eye icon when false.
	 */
	showLabel?: boolean;
};

export function PoisonVisibilityToggle({
	visible,
	onChange,
	disabled = false,
	showLabel = true,
}: PoisonVisibilityToggleProps) {
	if (showLabel) {
		return (
			<EnableToggle
				label='Show Poison?'
				enabled={visible}
				disabled={disabled}
				onChange={onChange}
			/>
		);
	}

	const actionLabel = visible ? 'Hide During Playback' : 'Always Show';

	return (
		<IconToggle
			label={`Poison Visibility: ${visible ? 'Visible' : 'Not Visible During Playback'}`}
			pressed={visible}
			pressedIcon={EyeIcon}
			unpressedIcon={EyeIcon}
			title={actionLabel}
			disabled={disabled}
			variant='header'
			onPressedChange={onChange}
		/>
	);
}
