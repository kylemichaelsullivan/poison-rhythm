import EyeIcon from '@/assets/svg/eye.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { useSetting } from '@/components/layout/settings/useSetting';

/** Eye toggle for next-measure preview — binds to `showNextMeasure`. */
export function NextMeasureToggle() {
	const [visible, setVisible] = useSetting('showNextMeasure');

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
			onPressedChange={setVisible}
		/>
	);
}
