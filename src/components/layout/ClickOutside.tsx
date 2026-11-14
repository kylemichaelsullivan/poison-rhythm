import { useEffect } from 'react';
import type { RefObject } from 'react';

type ClickOutsideProps = {
	wrapperRef: RefObject<HTMLElement | null>;
	onClickOutside: (e: MouseEvent) => void;
	/**
	 * When true (default), ignore clicks inside `.Modal` so header ShowNotes
	 * is not dismissed by dialog chrome. Difficulty help sets false.
	 */
	ignoreModalClicks?: boolean;
};

export function ClickOutside({
	wrapperRef,
	onClickOutside,
	ignoreModalClicks = true,
}: ClickOutsideProps) {
	useEffect(() => {
		const fn = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				ignoreModalClicks &&
				target instanceof Element &&
				target.closest('.Modal') !== null
			) {
				return;
			}
			if (wrapperRef.current && !wrapperRef.current.contains(target)) {
				onClickOutside(e);
			}
		};
		const t = setTimeout(() => document.addEventListener('click', fn), 0);
		return () => {
			clearTimeout(t);
			document.removeEventListener('click', fn);
		};
	}, [wrapperRef, onClickOutside, ignoreModalClicks]);
	return null;
}
