import clsx from 'clsx';
import type { ReactNode } from 'react';

export type CaptionSize = 'xs' | 'sm' | 'base';

type CaptionProps = {
	children: ReactNode;
	size?: CaptionSize;
};

const sizeClassName: Record<CaptionSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	base: 'text-base',
};

export function Caption({ children, size = 'xs' }: CaptionProps) {
	return (
		<p className={clsx('Caption text-dark', sizeClassName[size])}>{children}</p>
	);
}
