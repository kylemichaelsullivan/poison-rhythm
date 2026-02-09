import { ControlButton } from './ControlButton';

type ControlButtonsProps = {
	onNewPoison: () => void;
	onReusePoison: () => void;
	reuseDisabled?: boolean;
};

export function ControlButtons({
	onNewPoison,
	onReusePoison,
	reuseDisabled = false,
}: ControlButtonsProps) {
	return (
		<div className='ControlButtons flex flex-wrap justify-between gap-3 items-center'>
			<ControlButton label='New' onClick={onNewPoison} variant='primary' />
			<ControlButton
				label='Reuse'
				onClick={onReusePoison}
				disabled={reuseDisabled}
			/>
		</div>
	);
}
