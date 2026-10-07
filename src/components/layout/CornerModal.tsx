import { type ReactNode, useCallback } from 'react';
import { useDelayedClick } from '@/hooks/useDelayedClick';
import { useDisclosure } from '@/hooks/useDisclosure';
import { CornerButton, type CornerButtonTone } from './CornerButton';
import type { SvgIconComponent } from './Icon';
import { Modal } from './Modal';
import type { ModalSize } from './ModalPanel';

type CornerModalProps = {
	label: string;
	icon?: SvgIconComponent;
	expanded?: boolean;
	/** Trailing content beside the icon on the trigger button. */
	detail?: ReactNode;
	title?: string;
	fullWidth?: boolean;
	size?: ModalSize;
	/** Mount modal body only while open. */
	lazy?: boolean;
	/** Trigger tone; `muted` for dashed mid styling (e.g. muted metronome). */
	tone?: CornerButtonTone;
	/** Tooltip on the trigger; defaults to `label`. */
	buttonTitle?: string;
	/**
	 * When set, a single click opens after a short delay; a double-click runs
	 * this instead and does not open the modal.
	 */
	onDoubleClick?: () => void;
	/** Called after the modal closes (X, scrim, or Escape). */
	onClose?: () => void;
	children?: ReactNode;
};

export function CornerModal({
	label,
	icon,
	expanded,
	detail,
	title,
	fullWidth,
	size,
	lazy = false,
	tone = 'default',
	buttonTitle,
	onDoubleClick,
	onClose,
	children,
}: CornerModalProps) {
	const { open, onOpen, onClose: closeDisclosure } = useDisclosure();

	const handleClose = useCallback(() => {
		closeDisclosure();
		onClose?.();
	}, [closeDisclosure, onClose]);

	const handleClick = useDelayedClick(onOpen, { onDoubleClick });

	return (
		<>
			<CornerButton
				label={label}
				icon={icon}
				expanded={expanded}
				tone={tone}
				title={buttonTitle}
				onClick={handleClick}
			>
				{detail}
			</CornerButton>
			<Modal
				open={open}
				title={title}
				fullWidth={fullWidth}
				size={size}
				onClose={handleClose}
			>
				{lazy ? (open ? children : null) : children}
			</Modal>
		</>
	);
}
