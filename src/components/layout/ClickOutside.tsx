import { useEffect } from 'react';
import type { RefObject } from 'react';

type ClickOutsideProps = {
	wrapperRef: RefObject<HTMLElement | null>;
	onClickOutside: (e: MouseEvent) => void;
};

export function ClickOutside({
	wrapperRef,
	onClickOutside,
}: ClickOutsideProps) {
	useEffect(() => {
		const fn = (e: MouseEvent) => {
			const target = e.target as Node;
			if (target instanceof Element && target.closest('.Modal') !== null) {
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
	}, [wrapperRef, onClickOutside]);
	return null;
}
