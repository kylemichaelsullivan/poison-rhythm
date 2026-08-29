import clsx from 'clsx';
import type { ReactNode } from 'react';

export type StackGap = '1' | '2' | '3' | '4';

type StackProps = {
	children: ReactNode;
	gap?: StackGap;
};

const gapClassName: Record<StackGap, string> = {
	'1': 'gap-1',
	'2': 'gap-2',
	'3': 'gap-3',
	'4': 'gap-4',
};

export function Stack({ children, gap = '4' }: StackProps) {
	return (
		<div className={clsx('Stack flex flex-col', gapClassName[gap])}>
			{children}
		</div>
	);
}
