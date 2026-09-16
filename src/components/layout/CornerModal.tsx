import { type ReactNode, useEffect, useRef, useState } from 'react';
import { CornerButton } from './CornerButton';
import type { SvgIconComponent } from './Icon';
import { Modal } from './Modal';

const DOUBLE_CLICK_MS = 280;

type CornerModalProps = {
	label: string;
	icon?: SvgIconComponent;
	expanded?: boolean;
	/** Trailing content beside the icon on the trigger button. */
	detail?: ReactNode;
	title?: string;
	fullWidth?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	/** Mount modal body only while open. */
	lazy?: boolean;
	/** Extra classes on the trigger (e.g. muted metronome). */
	buttonClassName?: string;
	/** Tooltip on the trigger; defaults to `label`. */
	buttonTitle?: string;
	/**
	 * When set, a single click opens after a short delay; a double-click runs
	 * this instead and does not open the modal.
	 */
	onDoubleClick?: () => void;
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
	buttonClassName,
	buttonTitle,
	onDoubleClick,
	children,
}: CornerModalProps) {
	const [open, setOpen] = useState(false);
	const clickTimerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (clickTimerRef.current !== undefined) {
				clearTimeout(clickTimerRef.current);
			}
		};
	}, []);

	function handleClick() {
		if (!onDoubleClick) {
			setOpen(true);
			return;
		}

		if (clickTimerRef.current !== undefined) {
			clearTimeout(clickTimerRef.current);
			clickTimerRef.current = undefined;
			onDoubleClick();
			return;
		}

		clickTimerRef.current = window.setTimeout(() => {
			clickTimerRef.current = undefined;
			setOpen(true);
		}, DOUBLE_CLICK_MS);
	}

	return (
		<>
			<CornerButton
				label={label}
				icon={icon}
				expanded={expanded}
				className={buttonClassName}
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
				onClose={() => setOpen(false)}
			>
				{lazy ? (open ? children : null) : children}
			</Modal>
		</>
	);
}
