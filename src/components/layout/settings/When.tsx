import type { ReactNode } from 'react';

type WhenProps = {
	condition: boolean;
	children: ReactNode;
};

export function When({ condition, children }: WhenProps) {
	return condition ? children : null;
}
