import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';
import { IconToggle } from './IconToggle';
import { SettingRow } from './SettingRow';
import type { SvgIconComponent } from '@/components/layout/Icon';

type EnableToggleProps = {
	label: string;
	enabled: boolean;
	onChange?: (enabled: boolean) => void;
	disabled?: boolean;
	/** Glyph shown while enabled. Defaults to the checkmark. */
	icon?: SvgIconComponent;
	/** Tooltip; defaults to Click to Enable/Disable plus the row label. */
	title?: string;
};

export function EnableToggle({
	label,
	enabled,
	onChange,
	disabled = false,
	icon = CheckmarkIcon,
	title,
}: EnableToggleProps) {
	const actionLabel = enabled ? 'Disable' : 'Enable';

	return (
		<SettingRow label={label}>
			<IconToggle
				label={`${label}: ${actionLabel}`}
				pressed={enabled}
				pressedIcon={icon}
				title={title ?? `Click to ${actionLabel} ${label}`}
				disabled={disabled}
				variant='checkbox'
				onPressedChange={onChange}
			/>
		</SettingRow>
	);
}
