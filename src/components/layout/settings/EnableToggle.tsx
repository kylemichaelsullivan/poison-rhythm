import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';
import { IconToggle } from './IconToggle';
import { SettingRow } from './SettingRow';

type EnableToggleProps = {
	label: string;
	enabled: boolean;
	onChange?: (enabled: boolean) => void;
	disabled?: boolean;
};

export function EnableToggle({
	label,
	enabled,
	onChange,
	disabled = false,
}: EnableToggleProps) {
	const actionLabel = enabled ? 'Disable' : 'Enable';

	return (
		<SettingRow label={label}>
			<IconToggle
				label={`${label}: ${actionLabel}`}
				pressed={enabled}
				pressedIcon={CheckmarkIcon}
				title={`Click to ${actionLabel}`}
				disabled={disabled}
				variant='checkbox'
				onPressedChange={onChange}
			/>
		</SettingRow>
	);
}
