import clsx from 'clsx';
import type { ReactNode } from 'react';
import { darkSurfaceClassName } from '@/lib/control-classes';
import { SectionTitle } from '.';

type SectionProps = {
	title: string;
	headerAction?: ReactNode;
	children: ReactNode;
};

export function Section({ title, headerAction, children }: SectionProps) {
	return (
		<section
			className={clsx(
				'Section flex flex-col gap-4 border border-mid rounded-lg w-full p-4',
				darkSurfaceClassName,
			)}
		>
			<div className='flex items-center justify-start gap-2'>
				<SectionTitle>{title}</SectionTitle>
				{headerAction}
			</div>
			{children}
		</section>
	);
}
