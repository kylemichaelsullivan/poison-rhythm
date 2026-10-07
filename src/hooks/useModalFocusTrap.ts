import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * When `open`, moves focus into the dialog, traps Tab, closes on Escape, and
 * restores focus to the previously focused element on cleanup.
 */
export function useModalFocusTrap(
	open: boolean,
	onClose: () => void,
	dialogRef: RefObject<HTMLElement | null>,
): void {
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);

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
	}, [open, onClose, dialogRef]);
}
