import FullVolumeIcon from '@/assets/svg/full-volume.svg?react';
import MuteIcon from '@/assets/svg/mute.svg?react';
import { IconToggle } from './IconToggle';
import { SettingRow } from './SettingRow';

type MuteToggleProps = {
	label: string;
	muted: boolean;
	onChange?: (muted: boolean) => void;
	disabled?: boolean;
};

export function MuteToggle({
	label,
	muted,
	onChange,
	disabled = false,
}: MuteToggleProps) {
	const actionLabel = muted ? 'Unmute' : 'Mute';

	return (
		<SettingRow label={label}>
			<IconToggle
				label={`${label}: ${actionLabel}`}
				pressed={muted}
				pressedIcon={MuteIcon}
				unpressedIcon={FullVolumeIcon}
				title={`Click to ${actionLabel}`}
				disabled={disabled}
				variant='checkbox'
				onPressedChange={onChange}
				selectedWhenPressed={false}
			/>
		</SettingRow>
	);
}
