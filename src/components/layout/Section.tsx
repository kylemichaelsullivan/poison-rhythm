import type { ReactNode } from 'react';
import { SectionTitle } from '.';

type SectionProps = {
	title: string;
	headerAction?: ReactNode;
	children: ReactNode;
};

export function Section({ title, headerAction, children }: SectionProps) {
	return (
		<section className='Section flex flex-col gap-4 bg-dark/50 border border-mid rounded-lg w-full p-4'>
			<div className='flex items-center justify-start gap-2'>
				<SectionTitle>{title}</SectionTitle>
				{headerAction}
			</div>
			{children}
		</section>
	);
}
