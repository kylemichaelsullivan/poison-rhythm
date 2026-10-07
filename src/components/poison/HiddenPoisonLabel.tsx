import type { ReactNode } from 'react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { Icon } from '@/components/layout/Icon';
import { Row } from '@/components/ui';

type HiddenPoisonLabelProps = {
	children: ReactNode;
};

/** Eye + text label for the hidden poison overlay. */
export function HiddenPoisonLabel({ children }: HiddenPoisonLabelProps) {
	return (
		<Row gap='2' align='center'>
			<Icon svg={EyeIcon} size='md' inline />
			<span className='text-sm'>{children}</span>
		</Row>
	);
}
