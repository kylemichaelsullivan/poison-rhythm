import type { SvgIconComponent } from '@/components/layout/Icon';
import { SegmentButton } from './SegmentButton';

type IconToggleProps = {
	pressed: boolean;
	onPressedChange?: (pressed: boolean) => void;
	pressedIcon: SvgIconComponent;
	unpressedIcon: SvgIconComponent;
	label: string;
	title: string;
	disabled?: boolean;
	/** When false, primary style applies while unpressed (e.g. mute). Default true. */
	selectedWhenPressed?: boolean;
};

export function IconToggle({
	pressed,
	onPressedChange,
	pressedIcon,
	unpressedIcon,
	label,
	title,
	disabled = false,
	selectedWhenPressed = true,
}: IconToggleProps) {
	return (
		<SegmentButton
			label={label}
			title={title}
			icon={pressed ? pressedIcon : unpressedIcon}
			selected={selectedWhenPressed ? pressed : !pressed}
			pressed={pressed}
			grow={false}
			disabled={disabled}
			onClick={() => onPressedChange?.(!pressed)}
		/>
	);
}
