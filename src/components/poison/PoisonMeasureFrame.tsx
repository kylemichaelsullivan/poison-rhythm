import clsx from 'clsx';
import type { ReactNode } from 'react';
import EyeIcon from '@/assets/svg/eye.svg?react';
import { Icon } from '@/components/layout/Icon';
import { Row } from '@/components/ui';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type PoisonMeasureFrameProps = {
	hidden: boolean;
	/** Shown when hidden so the blank area isn’t empty (e.g. during playback). */
	hiddenLabel?: string;
	/** When set, the hidden overlay toggles poison visibility on click. */
	onHiddenClick?: () => void;
	children: ReactNode;
};

function HiddenPoisonLabel({ children }: { children: ReactNode }) {
	return (
		<Row gap='2' align='center'>
			<Icon svg={EyeIcon} size='md' inline />
			<span className='text-sm'>{children}</span>
		</Row>
	);
}

/** Visibility layer for the poison reference grid (invisible keeps layout). */
export function PoisonMeasureFrame({
	hidden,
	hiddenLabel,
	onHiddenClick,
	children,
}: PoisonMeasureFrameProps) {
	const overlayClassName =
		'absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 text-primary';

	return (
		<div className='PoisonMeasureFrame relative w-full'>
			<div
				className={hidden ? 'invisible' : undefined}
				aria-hidden={hidden || undefined}
			>
				{children}
			</div>
			{hidden && hiddenLabel ? (
				onHiddenClick ? (
					<button
						type='button'
						className={clsx(
							overlayClassName,
							'cursor-pointer transition hover:border-primary hover:bg-primary/10',
							focusVisibleRingClassName,
						)}
						title='Always Show'
						aria-label='Always Show Poison Rhythm'
						onClick={onHiddenClick}
					>
						<HiddenPoisonLabel>{hiddenLabel}</HiddenPoisonLabel>
					</button>
				) : (
					<output className={overlayClassName}>
						<HiddenPoisonLabel>{hiddenLabel}</HiddenPoisonLabel>
					</output>
				)
			) : null}
		</div>
	);
}
