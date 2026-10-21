import clsx from 'clsx';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap';
import { useTimedDismiss } from '@/hooks/useTimedDismiss';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalPanel, type ModalSize } from './ModalPanel';
import { ModalScrim } from './ModalScrim';
import { ModalTitle } from './ModalTitle';
import { TimedNoticeProgress } from './TimedNoticeProgress';

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

	return (
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
				<ModalCloseButton onClose={onClose} />
				{title ? (
					<ModalTitle id={titleId} sheet={sheet}>
						{title}
					</ModalTitle>
				) : null}
				<div
					className={clsx(
						'flex min-h-0 flex-col',
						sheet ? 'flex-1' : 'shrink-0',
					)}
				>
					{children}
				</div>
			</ModalPanel>
		</div>
	);
}
