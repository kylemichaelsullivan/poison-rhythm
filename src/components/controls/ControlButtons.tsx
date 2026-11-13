import PlusIcon from '@/assets/svg/plus.svg?react';
import RepeatIcon from '@/assets/svg/repeat.svg?react';
import {
	GENERATE_ROUND_TITLE,
	NEW_LABEL,
	NEW_ROUND_TITLE,
	REUSE_LABEL,
	REUSE_ROUND_TITLE,
} from '@/lib/ui-copy';
import { ControlButton } from './ControlButton';

type ControlButtonsProps = {
	onNewPoison: () => void;
	onReusePoison: () => void;
	reuseDisabled?: boolean;
	onReuseDisabledClick?: () => void;
};

export function ControlButtons({
	onNewPoison,
	onReusePoison,
	reuseDisabled = false,
	onReuseDisabledClick,
}: ControlButtonsProps) {
	return (
		<div className='ControlButtons flex flex-wrap justify-between gap-3 items-center'>
			<ControlButton
				variant='primary'
				label={NEW_LABEL}
				icon={PlusIcon}
				title={NEW_ROUND_TITLE}
				onClick={onNewPoison}
			/>
			<ControlButton
				label={REUSE_LABEL}
				icon={RepeatIcon}
				title={reuseDisabled ? GENERATE_ROUND_TITLE : REUSE_ROUND_TITLE}
				onClick={onReusePoison}
				disabled={reuseDisabled}
				onDisabledClick={onReuseDisabledClick}
			/>
		</div>
	);
}
