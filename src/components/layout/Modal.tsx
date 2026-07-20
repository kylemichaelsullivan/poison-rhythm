import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';

type ModalProps = {
	open: boolean;
	fullWidth?: boolean;
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

export function Modal({
	open,
	fullWidth = false,
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

	return (
		<div className='Modal fixed flex items-center justify-center p-4 inset-0 z-50'>
			<button
				type='button'
				className='absolute bg-black/50 inset-0'
				aria-label='Close modal'
				onClick={onClose}
			/>
			<div
				className={clsx(
					'relative flex flex-col gap-4 bg-white/80 backdrop-blur-md border border-mid shadow-lg w-full p-6',
					fullWidth ? 'max-w-none rounded-none' : 'max-w-sm rounded-lg',
				)}
				role='dialog'
				tabIndex={-1}
				aria-modal='true'
				aria-labelledby={title ? titleId : undefined}
				aria-label={title ? undefined : (ariaLabel ?? 'Modal')}
				ref={dialogRef}
			>
				<button
					type='button'
					className='absolute top-3 right-3 flex justify-center items-center w-8 h-8 text-xl font-semibold leading-none text-dark transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
					aria-label='Close modal'
					onClick={onClose}
				>
					X
				</button>
				{title && (
					<h2 className='text-lg font-semibold text-center' id={titleId}>
						{title}
					</h2>
				)}
				{children}
			</div>
		</div>
	);
}
