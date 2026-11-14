import { Modal } from './Modal';
import type { ReactNode } from 'react';
import type { ModalSize } from './ModalPanel';

type ContentModalProps = {
	open: boolean;
	title: string;
	onClose: () => void;
	size?: ModalSize;
	fullWidth?: boolean;
	children: ReactNode;
};

/** Thin titled Modal shell for content-only dialogs (Display Mode, …). */
export function ContentModal({
	open,
	title,
	onClose,
	size,
	fullWidth,
	children,
}: ContentModalProps) {
	return (
		<Modal
			open={open}
			title={title}
			onClose={onClose}
			size={size}
			fullWidth={fullWidth}
		>
			{children}
		</Modal>
	);
}
