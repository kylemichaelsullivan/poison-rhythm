import clsx from 'clsx';
import { type ReactNode, useId, useRef } from 'react';
import { useModalFocusTrap } from '@/hooks/useModalFocusTrap';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalPanel, type ModalSize } from './ModalPanel';
import { ModalScrim } from './ModalScrim';
import { ModalTitle } from './ModalTitle';

type ModalProps = {
	open: boolean;
	fullWidth?: boolean;
	size?: ModalSize;
	title?: string;
	/** Used when `title` is omitted so the dialog still has an accessible name. */
	ariaLabel?: string;
	onClose: () => void;
	children?: ReactNode;
};

export function Modal({
	open,
	fullWidth = false,
	size = 'sm',
	title,
	ariaLabel,
	onClose,
	children,
}: ModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const titleId = useId();

	useModalFocusTrap(open, onClose, dialogRef);

	if (!open) {
		return null;
	}

	return (
		<div
			className={clsx(
				'Modal fixed inset-0 z-50 flex items-center justify-center',
				'p-[max(0px,env(safe-area-inset-top))] max-sm:p-0',
				'sm:p-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]',
			)}
		>
			<ModalScrim onClose={onClose} />
			<ModalPanel
				size={size}
				fullWidth={fullWidth}
				labelledBy={title ? titleId : undefined}
				ariaLabel={ariaLabel}
				ref={dialogRef}
			>
				<ModalCloseButton onClose={onClose} />
				{title ? <ModalTitle id={titleId}>{title}</ModalTitle> : null}
				<div className='flex min-h-0 flex-1 flex-col'>{children}</div>
			</ModalPanel>
		</div>
	);
}
