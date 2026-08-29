import clsx from 'clsx';
import type { ReactNode } from 'react';
import { darkSurfaceClassName } from '@/lib/control-classes';
import { SectionTitle } from '.';

type SectionProps = {
	title: string;
	/** Content immediately after the title (left cluster). */
	headerLeading?: ReactNode;
	/** Content aligned to the trailing edge of the header. */
	headerAction?: ReactNode;
	children: ReactNode;
};

export function Section({
	title,
	headerLeading,
	headerAction,
	children,
}: SectionProps) {
	return (
		<section
			className={clsx(
				'Section flex flex-col gap-4 border border-mid rounded-lg w-full p-4',
				darkSurfaceClassName,
			)}
		>
			<div className='flex w-full items-center justify-between gap-3'>
				<div className='flex min-w-0 items-center gap-2'>
					<SectionTitle>{title}</SectionTitle>
					{headerLeading}
				</div>
				{headerAction}
			</div>
			{children}
		</section>
	);
}
