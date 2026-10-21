import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';
import { modalPanelClassName } from '@/lib/control-classes';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

type ModalPanelProps = {
	size?: ModalSize;
	fullWidth?: boolean;
	/** Clip to the panel radius. Used when a timed-notice bar sits on the top edge. */
	clip?: boolean;
	/** Pointer is over the panel. Timed notices pause while this is true. */
	onHoverChange?: (hovered: boolean) => void;
	labelledBy?: string;
	ariaLabel?: string;
	children: ReactNode;
	ref?: Ref<HTMLDivElement>;
};

/** Dialog shell with size / fullWidth variants. */
export function ModalPanel({
	size = 'sm',
	fullWidth = false,
	clip = false,
	onHoverChange,
	labelledBy,
	ariaLabel,
	children,
	ref,
}: ModalPanelProps) {
	const isXl = size === 'xl';

	const sizeClassName = isXl
		? 'sm:h-[80vh] sm:max-h-[80vh] sm:w-[80vw] sm:max-w-3xl'
		: size === 'lg'
			? 'sm:max-w-xl'
			: size === 'md'
				? 'sm:max-w-md'
				: 'sm:max-w-sm';

	return (
		<div
			className={clsx(
				'ModalPanel relative flex min-h-0 w-full flex-col',
				// xl Settings sheet: edge-to-edge full height on phones.
				// Smaller modals (About, etc.) hug content and stay centered in the scrim.
				isXl
					? 'gap-0 p-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:w-full max-sm:max-w-none max-sm:rounded-none sm:gap-4 sm:p-6 sm:max-h-[80vh]'
					: 'gap-4 p-4 max-sm:max-h-[min(100dvh,100%)] sm:p-6 sm:max-h-[min(90vh,40rem)]',
				modalPanelClassName,
				clip && 'overflow-hidden',
				fullWidth
					? 'max-w-none rounded-none'
					: clsx(sizeClassName, 'rounded-lg'),
			)}
			role='dialog'
			onMouseEnter={onHoverChange ? () => onHoverChange(true) : undefined}
			onMouseLeave={onHoverChange ? () => onHoverChange(false) : undefined}
			aria-modal='true'
			aria-labelledby={labelledBy}
			aria-label={labelledBy ? undefined : (ariaLabel ?? 'Modal')}
			tabIndex={-1}
			ref={ref}
		>
			{children}
		</div>
	);
}
