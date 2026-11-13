import {
	clickToTitle,
	enableActionLabel,
	muteActionLabel,
	showHideActionLabel,
	statusOnOffLabel,
} from '@/lib/ui-copy';
import { IconToggle } from './IconToggle';
import type { SvgIconComponent } from '@/components/layout/Icon';
import type {
	SegmentControlSize,
	SegmentControlVariant,
} from '@/lib/control-classes';

export type StatusIconCopyStrategy =
	| 'enableDisable'
	| 'showHide'
	| 'muteUnmute';

type StatusIconToggleProps = {
	/** Feature name used in aria label and default Click-to subject. */
	name: string;
	pressed: boolean;
	onPressedChange?: (pressed: boolean) => void;
	pressedIcon: SvgIconComponent;
	unpressedIcon?: SvgIconComponent;
	strategy: StatusIconCopyStrategy;
	/** Override Click-to subject (e.g. “Next Measure” instead of full name). */
	titleSubject?: string;
	/** `onOff` → `Name: On/Off`; `plain` → name only (feedback chips). */
	labelMode?: 'onOff' | 'plain';
	/** Override computed title. */
	title?: string;
	disabled?: boolean;
	selectedWhenPressed?: boolean;
	grow?: boolean | 'auto';
	variant?: SegmentControlVariant;
	size?: SegmentControlSize;
};

function actionForStrategy(
	strategy: StatusIconCopyStrategy,
	pressed: boolean,
): string {
	switch (strategy) {
		case 'showHide':
			return showHideActionLabel(pressed);
		case 'muteUnmute':
			return muteActionLabel(pressed);
		default:
			return enableActionLabel(pressed);
	}
}

/**
 * IconToggle with shared On/Off or plain labels and Click-to titles
 * from `ui-copy` strategies.
 */
export function StatusIconToggle({
	name,
	pressed,
	onPressedChange,
	pressedIcon,
	unpressedIcon,
	strategy,
	titleSubject,
	labelMode = 'onOff',
	title,
	disabled = false,
	selectedWhenPressed = true,
	grow = false,
	variant = 'segment',
	size = 'md',
}: StatusIconToggleProps) {
	const action = actionForStrategy(strategy, pressed);
	const label = labelMode === 'onOff' ? statusOnOffLabel(name, pressed) : name;

	return (
		<IconToggle
			label={label}
			title={title ?? clickToTitle(action, titleSubject ?? name)}
			pressed={pressed}
			pressedIcon={pressedIcon}
			unpressedIcon={unpressedIcon}
			disabled={disabled}
			selectedWhenPressed={selectedWhenPressed}
			grow={grow}
			variant={variant}
			size={size}
			onPressedChange={onPressedChange}
		/>
	);
}
