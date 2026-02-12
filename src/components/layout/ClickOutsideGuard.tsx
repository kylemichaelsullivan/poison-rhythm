import type { RefObject } from 'react';
import { useEffect } from 'react';

type ClickOutsideGuardProps = {
	wrapperRef: RefObject<HTMLElement | null>;
	onClickOutside: (e: MouseEvent) => void;
};

export function ClickOutsideGuard({
	wrapperRef,
	onClickOutside,
}: ClickOutsideGuardProps) {
	useEffect(() => {
		const fn = (e: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				onClickOutside(e);
			}
		};
		const t = setTimeout(() => document.addEventListener('click', fn), 0);
		return () => {
			clearTimeout(t);
			document.removeEventListener('click', fn);
		};
	}, [wrapperRef, onClickOutside]);
	return null;
}
