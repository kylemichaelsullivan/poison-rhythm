import EyeIcon from '@/assets/svg/eye.svg?react';
import { IconToggle } from '@/components/layout/settings';

type NextMeasureToggleProps = {
	visible: boolean;
	onVisibleChange: (visible: boolean) => void;
};

/** Eye toggle for next-measure preview visibility. */
export function NextMeasureToggle({
	visible,
	onVisibleChange,
}: NextMeasureToggleProps) {
	return (
		<IconToggle
			label={
				visible
					? 'Next Measure Preview: Visible'
					: 'Next Measure Preview: Hidden'
			}
			title={visible ? 'Hide Next Measure' : 'Show Next Measure'}
			pressed={visible}
			pressedIcon={EyeIcon}
			unpressedIcon={EyeIcon}
			variant='header'
			grow={false}
			onPressedChange={onVisibleChange}
		/>
	);
}
