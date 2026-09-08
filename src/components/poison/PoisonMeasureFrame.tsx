import type { ReactNode } from 'react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { Icon } from '@/components/layout/Icon';
import { Row } from '@/components/ui';

type PoisonMeasureFrameProps = {
	hidden: boolean;
	/** Shown when hidden so the blank area isn’t empty (e.g. during playback). */
	hiddenLabel?: string;
	children: ReactNode;
};

/** Visibility layer for the poison reference grid (invisible keeps layout). */
export function PoisonMeasureFrame({
	hidden,
	hiddenLabel,
	children,
}: PoisonMeasureFrameProps) {
	return (
		<div className='PoisonMeasureFrame relative w-full'>
			<div
				className={hidden ? 'invisible' : undefined}
				aria-hidden={hidden || undefined}
			>
				{children}
			</div>
			{hidden && hiddenLabel ? (
				<output className='absolute inset-0 flex items-center justify-center rounded-lg border border-dashed border-mid text-mid'>
					<Row gap='2' align='center'>
						<Icon svg={EyeIcon} size='md' inline />
						<span className='text-sm'>{hiddenLabel}</span>
					</Row>
				</output>
			) : null}
		</div>
	);
}
