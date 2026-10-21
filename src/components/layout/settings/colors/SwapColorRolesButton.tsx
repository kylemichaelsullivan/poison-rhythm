import SwapIcon from '@/assets/svg/swap.svg?react';
import { Icon } from '@/components/layout/Icon';
import { IconButton } from '@/components/ui';

type SwapColorRolesButtonProps = {
	onSwap: () => void;
};

/** Exchanges Dominant and Secondary color preferences. */
export function SwapColorRolesButton({ onSwap }: SwapColorRolesButtonProps) {
	return (
		<IconButton
			variant='info'
			label='Swap Dominant and Secondary'
			title='Swap Dominant and Secondary'
			onClick={onSwap}
		>
			<span className='inline-flex rotate-90 sm:rotate-0'>
				<Icon svg={SwapIcon} size='sm' />
			</span>
		</IconButton>
	);
}
