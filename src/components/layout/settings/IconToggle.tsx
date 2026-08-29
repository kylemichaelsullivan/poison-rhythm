import type { SvgIconComponent } from '@/components/layout/Icon';
import type { SegmentControlVariant } from '@/lib/control-classes';
import { SegmentButton } from './SegmentButton';

type IconToggleProps = {
	pressed: boolean;
	onPressedChange?: (pressed: boolean) => void;
	pressedIcon: SvgIconComponent;
	unpressedIcon?: SvgIconComponent;
	label: string;
	title: string;
	disabled?: boolean;
	/** When false, primary style applies while unpressed (e.g. mute). Default true. */
	selectedWhenPressed?: boolean;
	/** Fill available row space (`true` → flex-1, `'auto'` → flex-auto). */
	grow?: boolean | 'auto';
	variant?: SegmentControlVariant;
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
	grow = false,
	variant = 'segment',
}: IconToggleProps) {
	const icon = pressed ? pressedIcon : unpressedIcon;

	return (
		<SegmentButton
			label={label}
			title={title}
			icon={icon}
			selected={selectedWhenPressed ? pressed : !pressed}
			pressed={pressed}
			grow={grow}
			disabled={disabled}
			variant={variant}
			onClick={() => onPressedChange?.(!pressed)}
		/>
	);
}
