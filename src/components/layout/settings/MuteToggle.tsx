import EarIcon from '@/assets/svg/ear.svg?react';
import Volume0Icon from '@/assets/svg/volume-0.svg?react';
import { clickToTitle, muteActionLabel } from '@/lib/ui-copy';
import { IconToggle } from './IconToggle';
import { SettingRow } from './SettingRow';

type MuteToggleProps = {
	label: string;
	muted: boolean;
	onChange?: (muted: boolean) => void;
	disabled?: boolean;
	title?: string;
};

export function MuteToggle({
	label,
	muted,
	onChange,
	disabled = false,
	title,
}: MuteToggleProps) {
	const action = muteActionLabel(muted);

	return (
		<SettingRow label={label}>
			<IconToggle
				label={`${label}: ${action}`}
				pressed={muted}
				pressedIcon={Volume0Icon}
				unpressedIcon={EarIcon}
				title={title ?? clickToTitle(action, label)}
				disabled={disabled}
				variant='checkbox'
				onPressedChange={onChange}
				selectedWhenPressed={false}
			/>
		</SettingRow>
	);
}
