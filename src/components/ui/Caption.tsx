import clsx from 'clsx';
import type { ReactNode } from 'react';

export type CaptionSize = 'xs' | 'sm';

type CaptionProps = {
	children: ReactNode;
	size?: CaptionSize;
};

const sizeClassName: Record<CaptionSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
};

export function Caption({ children, size = 'xs' }: CaptionProps) {
	return (
		<p className={clsx('Caption text-dark', sizeClassName[size])}>{children}</p>
	);
}
