import type { ReactNode } from 'react';
import { HiddenPoisonOverlay } from './HiddenPoisonOverlay';

type PoisonMeasureFrameProps = {
	hidden: boolean;
	/** Shown when hidden so the blank area isn’t empty (e.g. during playback). */
	hiddenLabel?: string;
	/** When set, the hidden overlay toggles poison visibility on click. */
	onHiddenClick?: () => void;
	children: ReactNode;
};

/** Visibility layer for the poison reference grid (invisible keeps layout). */
export function PoisonMeasureFrame({
	hidden,
	hiddenLabel,
	onHiddenClick,
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
				<HiddenPoisonOverlay
					label={hiddenLabel}
					interactive={onHiddenClick != null}
					onClick={onHiddenClick}
				/>
			) : null}
		</div>
	);
}
