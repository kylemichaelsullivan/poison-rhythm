import clsx from 'clsx';
import type { ReactNode } from 'react';
import { SectionTitle } from '.';

type SectionTitleSide = 'start' | 'end';

type SectionProps = {
	title: string;
	/** Content in the leading cluster. Sits after the title when `titleSide` is `start`. */
	headerLeading?: ReactNode;
	/** Content in the trailing cluster. Sits after the title when `titleSide` is `end`. */
	headerAction?: ReactNode;
	/** Which edge the title sits on. */
	titleSide?: SectionTitleSide;
	children: ReactNode;
};

export function Section({
	title,
	headerLeading,
	headerAction,
	titleSide = 'start',
	children,
}: SectionProps) {
	const titleNode = <SectionTitle>{title}</SectionTitle>;
	const start =
		titleSide === 'start' ? (
			<>
				{titleNode}
				{headerLeading}
			</>
		) : (
			headerLeading
		);
	const end =
		titleSide === 'end' ? (
			<>
				{titleNode}
				{headerAction}
			</>
		) : (
			headerAction
		);

	return (
		<section className='Section flex w-full flex-col gap-4 rounded-lg border-2 border-secondary bg-surface p-4 text-black'>
			<div className='flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2'>
				<div className='flex min-w-0 items-center gap-2'>{start}</div>
				{end ? (
					<div
						className={clsx(
							'flex min-w-0 items-center gap-2',
							titleSide === 'end' && 'ml-auto',
						)}
					>
						{end}
					</div>
				) : null}
			</div>
			{children}
		</section>
	);
}
