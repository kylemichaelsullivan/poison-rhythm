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

/** Near-fullscreen on phones; desktop sizes apply from `sm` upward. */
const phoneNearFullscreenClassName =
	'max-sm:h-[min(100dvh,100%)] max-sm:max-h-[min(100dvh,100%)] max-sm:w-full max-sm:max-w-none max-sm:rounded-none';

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
	const sizeClassName =
		size === 'xl'
			? 'sm:h-[80vh] sm:max-h-[80vh] sm:w-[80vw] sm:max-w-3xl'
			: size === 'lg'
				? 'sm:max-w-xl'
				: size === 'md'
					? 'sm:max-w-md'
					: 'sm:max-w-sm';

	const maxHeightClassName =
		size === 'xl'
			? 'max-sm:max-h-[min(100dvh,100%)] sm:max-h-[80vh]'
			: 'max-sm:max-h-[min(100dvh,100%)] sm:max-h-[min(90vh,40rem)]';

	return (
		<div
			className={clsx(
				'ModalPanel relative flex min-h-0 w-full flex-col gap-4 p-4 sm:p-6',
				maxHeightClassName,
				modalPanelClassName,
				phoneNearFullscreenClassName,
				clip && 'overflow-hidden',
				fullWidth
					? 'max-w-none rounded-none'
					: clsx(sizeClassName, 'sm:rounded-lg'),
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
