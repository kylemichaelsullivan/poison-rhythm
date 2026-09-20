import clsx from 'clsx';
import { type ReactNode, useEffect, useId, useRef } from 'react';
import {
	modalPanelClassName,
	modalScrimClassName,
} from '@/lib/control-classes';

type ModalProps = {
	open: boolean;
	fullWidth?: boolean;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	title?: string;
	/** Used when `title` is omitted so the dialog still has an accessible name. */
	ariaLabel?: string;
	onClose: () => void;
	children?: ReactNode;
};

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Near-fullscreen on phones; desktop sizes apply from `sm` upward. */
const phoneNearFullscreenClassName =
	'max-sm:h-[min(100dvh,100%)] max-sm:max-h-[min(100dvh,100%)] max-sm:w-full max-sm:max-w-none max-sm:rounded-none';

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
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);
	const titleId = useId();

	useEffect(() => {
		if (!open) {
			return;
		}

		previouslyFocusedRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		const dialog = dialogRef.current;
		const focusable = dialog
			? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
			: [];
		const initialFocus =
			focusable.find(
				(element) => element.dataset.modalInitialFocus === 'true',
			) ??
			focusable[0] ??
			dialog;
		initialFocus?.focus();

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.preventDefault();
				onClose();
				return;
			}

			if (e.key !== 'Tab' || !dialog) {
				return;
			}

			const nodes = Array.from(
				dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
			);
			if (nodes.length === 0) {
				e.preventDefault();
				dialog.focus();
				return;
			}

			const first = nodes[0];
			const last = nodes[nodes.length - 1];
			const active = document.activeElement;

			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
				return;
			}

			if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			previouslyFocusedRef.current?.focus();
		};
	}, [open, onClose]);

	if (!open) {
		return null;
	}

	const sizeClassName =
		size === 'xl'
			? 'sm:h-[80vh] sm:max-h-[80vh] sm:w-[80vw] sm:max-w-3xl'
			: size === 'lg'
				? 'sm:max-w-lg'
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
				'Modal fixed inset-0 z-50 flex items-center justify-center',
				'p-[max(0px,env(safe-area-inset-top))] max-sm:p-0',
				'sm:p-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]',
			)}
		>
			<button
				type='button'
				className={clsx('absolute inset-0', modalScrimClassName)}
				aria-label='Close Modal'
				onClick={onClose}
			/>
			<div
				className={clsx(
					'relative flex min-h-0 w-full flex-col gap-4 p-4 sm:p-6',
					maxHeightClassName,
					modalPanelClassName,
					phoneNearFullscreenClassName,
					fullWidth
						? 'max-w-none rounded-none'
						: clsx(sizeClassName, 'sm:rounded-lg'),
				)}
				role='dialog'
				aria-modal='true'
				aria-labelledby={title ? titleId : undefined}
				aria-label={title ? undefined : (ariaLabel ?? 'Modal')}
				tabIndex={-1}
				ref={dialogRef}
			>
				<button
					type='button'
					className='absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center text-xl font-semibold leading-none text-dark transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white'
					aria-label='Close Modal'
					onClick={onClose}
				>
					X
				</button>
				{title && (
					<h2
						className='shrink-0 pr-10 text-center text-lg font-semibold text-black'
						id={titleId}
					>
						{title}
					</h2>
				)}
				<div className='flex min-h-0 flex-1 flex-col'>{children}</div>
			</div>
		</div>
	);
}
