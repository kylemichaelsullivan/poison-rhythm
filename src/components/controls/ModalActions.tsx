import { Row } from '@/components/ui';
import type { ReactNode } from 'react';
import type { RowAlign } from '@/components/ui';

type ModalActionsProps = {
	children: ReactNode;
	justify?: RowAlign | 'between';
	fullWidth?: boolean;
	wrap?: boolean;
};

export function ModalActions({
	children,
	justify = 'end',
	fullWidth = false,
	wrap = false,
}: ModalActionsProps) {
	return (
		<Row gap='2' justify={justify} fullWidth={fullWidth} wrap={wrap}>
			{children}
		</Row>
	);
}
