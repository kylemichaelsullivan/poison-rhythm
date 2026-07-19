import { type ReactNode, useState } from 'react';
import { CornerButton } from './CornerButton';
import type { SvgIconComponent } from './Icon';
import { Modal } from './Modal';

type CornerModalProps = {
	label: string;
	icon?: SvgIconComponent;
	expanded?: boolean;
	/** Trailing content beside the icon on the trigger button. */
	detail?: ReactNode;
	title?: string;
	fullWidth?: boolean;
	/** Mount modal body only while open. */
	lazy?: boolean;
	children?: ReactNode;
};

export function CornerModal({
	label,
	icon,
	expanded,
	detail,
	title,
	fullWidth,
	lazy = false,
	children,
}: CornerModalProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<CornerButton
				label={label}
				icon={icon}
				expanded={expanded}
				onClick={() => setOpen(true)}
			>
				{detail}
			</CornerButton>
			<Modal
				open={open}
				title={title}
				fullWidth={fullWidth}
				onClose={() => setOpen(false)}
			>
				{lazy ? (open ? children : null) : children}
			</Modal>
		</>
	);
}
