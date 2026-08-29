import type { ReactNode } from 'react';
import { Row } from '@/components/ui';

type ModalActionsProps = {
	children: ReactNode;
};

export function ModalActions({ children }: ModalActionsProps) {
	return (
		<Row gap='2' justify='end'>
			{children}
		</Row>
	);
}
