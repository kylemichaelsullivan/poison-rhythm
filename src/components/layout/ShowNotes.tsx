import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts';
import { controlButtonBaseClassName } from '@/lib/control-classes';
import {
	indexToLevel,
	levelToIndex,
	SUBDIVISION_LABELS,
} from '@/lib/subdivision-levels';
import { ClickOutside } from './ClickOutside';
import { ShowNotesSlider } from './ShowNotesSlider';

export function ShowNotes() {
	const { subdivisionLevel, setSubdivisionLevel } = useTheme();
	const [open, setOpen] = useState(false);
	const pinnedRef = useRef(false);
	const closeTimerRef = useRef<number | undefined>(undefined);
	const focusSliderOnOpenRef = useRef(false);
	const sliderInputRef = useRef<HTMLInputElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const value = levelToIndex(subdivisionLevel);

	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== undefined) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (open && focusSliderOnOpenRef.current) {
			focusSliderOnOpenRef.current = false;
			sliderInputRef.current?.focus();
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

			e.preventDefault();
			e.stopPropagation();

			const delta = e.key === 'ArrowLeft' ? -1 : 1;
			setSubdivisionLevel(indexToLevel(value + delta));
		}

		function handleKeyUp(e: KeyboardEvent) {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

			e.stopPropagation();
		}

		window.addEventListener('keydown', handleKeyDown, true);
		window.addEventListener('keyup', handleKeyUp, true);

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
			window.removeEventListener('keyup', handleKeyUp, true);
		};
	}, [open, value, setSubdivisionLevel]);

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
		focusSliderOnOpenRef.current = true;
		setOpen(true);
	}

	function handleMouseLeave() {
		if (!pinnedRef.current) {
			scheduleClose();
		}
	}

	return (
		<div className='ShowNotes relative' ref={wrapperRef}>
			<button
				type='button'
				className={clsx(
					controlButtonBaseClassName,
					'flex items-center justify-center text-sm text-center w-10 h-10',
					open && 'ring-2 ring-primary',
				)}
				title='Note Subdivisions'
				onMouseEnter={handleHoverOpen}
				onMouseLeave={handleMouseLeave}
				onFocus={() => setOpen(true)}
				onBlur={(e) => {
					if (
						!pinnedRef.current &&
						!wrapperRef.current?.contains(e.relatedTarget as Node | null)
					) {
						setOpen(false);
					}
				}}
				onClick={handleButtonClick}
				aria-expanded={open}
				aria-haspopup='dialog'
				aria-label='Choose which note subdivisions to show'
			>
				{SUBDIVISION_LABELS[value]}
			</button>
			{open && (
				<>
					<ShowNotesSlider
						value={value}
						onMouseEnter={handleHoverOpen}
						onMouseLeave={handleMouseLeave}
						onChange={(i) => setSubdivisionLevel(indexToLevel(i))}
						inputRef={sliderInputRef}
					/>
					<ClickOutside
						wrapperRef={wrapperRef}
						onClickOutside={handleClickOutside}
					/>
				</>
			)}
		</div>
	);
}
