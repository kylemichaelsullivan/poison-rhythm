import type { ReactNode } from 'react';

export const sectionTitleClassName =
	'SectionTitle text-lg font-semibold text-black';

type SectionTitleProps = {
	children: ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
	return <h2 className={sectionTitleClassName}>{children}</h2>;
}
