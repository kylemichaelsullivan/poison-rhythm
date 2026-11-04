import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { modalCornerControlClassName } from '@/lib/control-classes';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalPanel } from './ModalPanel';
import { ModalScrim } from './ModalScrim';
import { ModalTitle } from './ModalTitle';
import { TimedNoticeProgress } from './TimedNoticeProgress';
import type { ReactNode } from 'react';
import type { ModalSize } from './ModalPanel';

type ModalProps = {
	open: boolean;
	fullWidth?: boolean;
	size?: ModalSize;
	title?: string;
	/** Used when `title` is omitted so the dialog still has an accessible name. */
	ariaLabel?: string;
	onClose: () => void;
	/**
	 * When set, the dialog dismisses itself after this many milliseconds and
	 * shows a progress bar along the top edge. Omit for a manual dismiss only.
	 */
	dismissAfterMs?: number;
	/** Optional control in the upper-left corner (pairs with the close button). */
	headerLeading?: ReactNode;
	children?: ReactNode;
};

export function Modal({
	open,
	fullWidth = false,
	size = 'sm',
	title,
	ariaLabel,
	onClose,
	dismissAfterMs,
	headerLeading,
	children,
}: ModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const [noticePaused, setNoticePaused] = useState(false);
	const timed = dismissAfterMs != null;

	useModalFocusTrap(open, onClose, dialogRef);
	useTimedDismiss(open, dismissAfterMs, onClose, noticePaused);

	useEffect(() => {
		if (!open) setNoticePaused(false);
	}, [open]);

	if (!open) {
		return null;
	}

	const sheet = size === 'xl';

	// Portal to body so nested dialogs (e.g. Difficulty Help inside About) are not
	// clipped by a parent ModalPanel’s overflow / backdrop-filter containing block.
	return createPortal(
		<div
			className={clsx(
				'Modal fixed inset-0 z-50 flex items-center justify-center',
				// Settings sheet is edge-to-edge; smaller modals keep inset so they center as cards.
				sheet
					? 'max-sm:p-0'
					: 'p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
				'sm:p-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]',
			)}
		>
			<ModalScrim onClose={onClose} />
			<ModalPanel
				size={size}
				fullWidth={fullWidth}
				clip={timed}
				onHoverChange={timed ? setNoticePaused : undefined}
				labelledBy={title ? titleId : undefined}
				ariaLabel={ariaLabel}
				ref={dialogRef}
			>
				{timed && dismissAfterMs != null ? (
					<TimedNoticeProgress
						durationMs={dismissAfterMs}
						paused={noticePaused}
					/>
				) : null}
				{headerLeading ? (
					<div
						className={clsx(
							'ModalHeaderLeading',
							modalCornerControlClassName('start'),
						)}
					>
						{headerLeading}
					</div>
				) : null}
				<ModalCloseButton onClose={onClose} />
				{title ? (
					<ModalTitle id={titleId} sheet={sheet}>
						{title}
					</ModalTitle>
				) : null}
				<div
					className={clsx(
						'flex min-h-0 flex-col',
						sheet ? 'flex-1' : 'overflow-y-auto overscroll-contain',
					)}
				>
					{children}
				</div>
			</ModalPanel>
		</div>,
		document.body,
	);
}
