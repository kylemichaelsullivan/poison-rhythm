import type { ReactNode } from 'react';

type SectionTitleProps = {
	children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
	return <h2 className='SectionTitle text-lg font-semibold'>{children}</h2>;
}
