import EyeIcon from '@/assets/svg/eye.svg?react';
import { POISON_SHOW_QUESTION, poisonVisibilityTitle } from '@/lib/ui-copy';
import { EnableToggle } from './EnableToggle';
import { IconToggle } from './IconToggle';
import { useSetting } from './useSetting';

type PoisonVisibilityToggleProps = {
	/**
	 * Settings row with “Show Poison?” checkbox when true (default).
	 * Header eye icon when false.
	 */
	showLabel?: boolean;
};

/**
 * Poison visibility — `poisonMode` visible vs hidden.
 * Disabled automatically in Bucket Drumming.
 */
export function PoisonVisibilityToggle({
	showLabel = true,
}: PoisonVisibilityToggleProps) {
	const [poisonMode, setPoisonMode] = useSetting('poisonMode');
	const [gameMode] = useSetting('gameMode');
	const visible = poisonMode === 'visible';
	const disabled = gameMode === 'bucketTrainer';
	const onChange = (next: boolean) => {
		setPoisonMode(next ? 'visible' : 'hidden');
	};
	const title = poisonVisibilityTitle(visible);

	if (showLabel) {
		return (
			<EnableToggle
				label={POISON_SHOW_QUESTION}
				enabled={visible}
				disabled={disabled}
				onChange={onChange}
				title={title}
			/>
		);
	}

	return (
		<IconToggle
			label={`Poison Visibility: ${visible ? 'Visible' : 'Not Visible During Playback'}`}
			pressed={visible}
			pressedIcon={EyeIcon}
			unpressedIcon={EyeIcon}
			title={title}
			disabled={disabled}
			variant='header'
			onPressedChange={onChange}
		/>
	);
}
