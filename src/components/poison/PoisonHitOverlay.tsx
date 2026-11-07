import clsx from 'clsx';
import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { POISON_HIT_DURATION_MS, POISON_HIT_TITLE } from '@/lib/poison-hit';
import { PoisonHitBottle } from './PoisonHitBottle';
import { PoisonHitSplat } from './PoisonHitSplat';

type PoisonHitOverlayProps = {
	open: boolean;
	onClose: () => void;
};

/**
 * Full-screen Classic poison-hit: title, bottle, then explode-and-clear.
 * Timed dismiss; click / Escape also closes. Endless never opens this.
 * Motion follows system `prefers-reduced-motion`.
 */
export function PoisonHitOverlay({ open, onClose }: PoisonHitOverlayProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();

	useModalFocusTrap(open, onClose, dialogRef);
	useTimedDismiss(open, POISON_HIT_DURATION_MS, onClose);

	if (!open) {
		return null;
	}

	return createPortal(
		<div
			className={clsx(
				'PoisonHitOverlay Modal fixed inset-0 z-50 flex items-center justify-center',
				'p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
			)}
			data-testid='poison-hit-overlay'
		>
			<button
				type='button'
				className='PoisonHitOverlayScrim absolute inset-0 border-0 bg-secondary'
				aria-label='Dismiss'
				data-modal-initial-focus='true'
				onClick={onClose}
			/>
			<PoisonHitSplat />
			<div
				className='PoisonHitOverlayPanel pointer-events-none relative z-10 flex max-w-lg flex-col items-center px-6 py-8 text-center outline-none'
				role='alertdialog'
				aria-modal='true'
				aria-labelledby={titleId}
				tabIndex={-1}
				ref={dialogRef}
			>
				<p
					id={titleId}
					className='PoisonHitOverlayTitle text-3xl font-bold tracking-tight text-primary sm:text-4xl'
				>
					{POISON_HIT_TITLE}
				</p>
				<PoisonHitBottle />
			</div>
		</div>,
		document.body,
	);
}
