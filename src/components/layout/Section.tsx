import type { ReactNode } from 'react';
import { SectionTitle } from './SectionTitle';

type SectionProps = {
	title: string;
	children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
	return (
		<section className='Section flex flex-col gap-4 bg-dark/50 border border-mid rounded-lg w-full p-4'>
			<SectionTitle>{title}</SectionTitle>
			{children}
		</section>
	);
}
