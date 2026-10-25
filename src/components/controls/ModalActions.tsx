import { Row } from '@/components/ui';
import type { ReactNode } from 'react';

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
