import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

type UseHoverPinPopoverResult = {
	open: boolean;
	wrapperRef: RefObject<HTMLDivElement | null>;
	focusTargetRef: RefObject<HTMLInputElement | null>;
	handleHoverOpen: () => void;
	handleMouseLeave: () => void;
	handleButtonClick: () => void;
	handleClickOutside: (e: MouseEvent) => void;
	handleBlur: (relatedTarget: EventTarget | null) => void;
	handleFocus: () => void;
};

/**
 * Hover-to-open + click-to-pin popover state (e.g. ShowNotes subdivision control).
 */
export function useHoverPinPopover(): UseHoverPinPopoverResult {
	const [open, setOpen] = useState(false);
	const pinnedRef = useRef(false);
	const closeTimerRef = useRef<number | undefined>(undefined);
	const focusOnOpenRef = useRef(false);
	const focusTargetRef = useRef<HTMLInputElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== undefined) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (open && focusOnOpenRef.current) {
			focusOnOpenRef.current = false;
			focusTargetRef.current?.focus();
		}
	}, [open]);

	function clearCloseTimer() {
		if (closeTimerRef.current !== undefined) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = undefined;
		}
	}

	function handleHoverOpen() {
		clearCloseTimer();
		setOpen(true);
	}

	function scheduleClose() {
		clearCloseTimer();
		closeTimerRef.current = window.setTimeout(() => {
			if (!pinnedRef.current) {
				setOpen(false);
			}
		}, 150);
	}

	function handleClickOutside(e: MouseEvent) {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
			clearCloseTimer();
			pinnedRef.current = false;
			setOpen(false);
		}
	}

	function handleButtonClick() {
		clearCloseTimer();

		if (open && pinnedRef.current) {
			pinnedRef.current = false;
			setOpen(false);
			return;
		}

		pinnedRef.current = true;
		focusOnOpenRef.current = true;
		setOpen(true);
	}

	function handleMouseLeave() {
		if (!pinnedRef.current) {
			scheduleClose();
		}
	}

	function handleFocus() {
		setOpen(true);
	}

	function handleBlur(relatedTarget: EventTarget | null) {
		if (
			!pinnedRef.current &&
			!wrapperRef.current?.contains(relatedTarget as Node | null)
		) {
			setOpen(false);
		}
	}

	return {
		open,
		wrapperRef,
		focusTargetRef,
		handleHoverOpen,
		handleMouseLeave,
		handleButtonClick,
		handleClickOutside,
		handleBlur,
		handleFocus,
	};
}
