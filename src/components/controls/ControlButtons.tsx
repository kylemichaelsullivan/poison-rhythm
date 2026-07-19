import type { Ref } from 'react';
import PlusIcon from '@/assets/svg/plus.svg?react';
import RepeatIcon from '@/assets/svg/repeat.svg?react';
import { ControlButton } from './ControlButton';

type ControlButtonsProps = {
	onNewPoison: () => void;
	onReusePoison: () => void;
	reuseDisabled?: boolean;
	onReuseDisabledClick?: () => void;
	newButtonRef?: Ref<HTMLButtonElement>;
};

export function ControlButtons({
	onNewPoison,
	onReusePoison,
	reuseDisabled = false,
	onReuseDisabledClick,
	newButtonRef,
}: ControlButtonsProps) {
	return (
		<div className='ControlButtons flex flex-wrap justify-between gap-3 items-center'>
			<ControlButton
				variant='primary'
				label='New'
				icon={PlusIcon}
				title='New Poison Rhythm, New Measures'
				onClick={onNewPoison}
				ref={newButtonRef}
			/>
			<ControlButton
				label='Reuse'
				icon={RepeatIcon}
				title={
					reuseDisabled
						? 'Click the New button first'
						: 'New Measures, Same Poison Rhythm'
				}
				onClick={onReusePoison}
				disabled={reuseDisabled}
				onDisabledClick={onReuseDisabledClick}
			/>
		</div>
	);
}
