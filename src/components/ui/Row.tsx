import clsx from 'clsx';
import type { ReactNode } from 'react';

export type RowGap = '1' | '2' | '3' | '4';
export type RowAlign = 'start' | 'center' | 'end';

type RowProps = {
	children: ReactNode;
	gap?: RowGap;
	align?: RowAlign;
	justify?: RowAlign | 'between';
	/** Stretch to parent width so flex-auto / flex-1 children can fill. */
	fullWidth?: boolean;
};

const gapClassName: Record<RowGap, string> = {
	'1': 'gap-1',
	'2': 'gap-2',
	'3': 'gap-3',
	'4': 'gap-4',
};

const alignClassName: Record<RowAlign, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
};

const justifyClassName: Record<RowAlign | 'between', string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
};

export function Row({
	children,
	gap = '2',
	align = 'center',
	justify = 'start',
	fullWidth = false,
}: RowProps) {
	return (
		<div
			className={clsx(
				'Row flex',
				fullWidth && 'w-full',
				gapClassName[gap],
				alignClassName[align],
				justifyClassName[justify],
			)}
		>
			{children}
		</div>
	);
}
