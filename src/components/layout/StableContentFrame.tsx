import type { ReactNode } from 'react';

type StableContentFrameProps = {
	spacer: ReactNode;
	children: ReactNode;
};

/** Reserves layout space from an invisible spacer so content swaps do not shift the page. */
export function StableContentFrame({
	spacer,
	children,
}: StableContentFrameProps) {
	return (
		<div className='StableContentFrame relative w-full overflow-hidden'>
			<div
				className='invisible pointer-events-none select-none'
				aria-hidden='true'
			>
				{spacer}
			</div>
			<div className='absolute inset-0 flex min-h-0 items-start [&>*]:min-h-0 [&>*]:w-full'>
				{children}
			</div>
		</div>
	);
}
