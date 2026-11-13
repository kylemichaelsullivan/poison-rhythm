import { useEffect } from 'react';
import { shouldIgnoreOutsideEscape } from '@/lib/keyboard-target';
import type { RefObject } from 'react';

type UseOutsideDismissOptions = {
	enabled: boolean;
	rootRef: RefObject<HTMLElement | null>;
	/** Called on outside pointerdown and (by default) Escape. */
	onDismiss: () => void;
	/** Override Escape handling (e.g. close + restore focus). Defaults to onDismiss. */
	onEscapeDismiss?: () => void;
	shouldIgnoreEscape?: (target: EventTarget | null) => boolean;
};

/**
 * Dismiss when the user pointerdowns outside `rootRef` or presses Escape.
 * Skips Escape while text inputs / dialogs / app modals are active by default.
 */
export function useOutsideDismiss({
	enabled,
	rootRef,
	onDismiss,
	onEscapeDismiss,
	shouldIgnoreEscape = shouldIgnoreOutsideEscape,
}: UseOutsideDismissOptions) {
	useEffect(() => {
		if (!enabled) return;

		const onPointerDown = (event: PointerEvent) => {
			if (rootRef.current?.contains(event.target as Node)) return;
			onDismiss();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			if (shouldIgnoreEscape(event.target)) return;
			event.preventDefault();
			(onEscapeDismiss ?? onDismiss)();
		};

		document.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [enabled, rootRef, onDismiss, onEscapeDismiss, shouldIgnoreEscape]);
}
