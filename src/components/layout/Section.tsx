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
				'Section flex flex-col gap-4 border-2 border-primary/25 rounded-lg w-full p-4',
				darkSurfaceClassName,
			)}
		>
			<div className='flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2'>
				<div className='flex min-w-0 flex-wrap items-center gap-2'>
					<SectionTitle>{title}</SectionTitle>
					{headerLeading}
				</div>
				{headerAction ? (
					<div className='flex min-w-0 flex-wrap items-center gap-2'>
						{headerAction}
					</div>
				) : null}
			</div>
			{children}
		</section>
	);
}
