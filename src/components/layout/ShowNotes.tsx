import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useTheme } from '@/contexts';
import {
	indexToLevel,
	levelToIndex,
	SUBDIVISION_LABELS,
} from '@/lib/subdivision-levels';
import { ClickOutsideGuard } from './ClickOutsideGuard';
import { ShowNotesSlider } from './ShowNotesSlider';

export function ShowNotes() {
	const { subdivisionLevel, setSubdivisionLevel } = useTheme();
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const value = levelToIndex(subdivisionLevel);

	function handleClickOutside(e: MouseEvent) {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
			setOpen(false);
		}
	}

	return (
		<div ref={wrapperRef} className='ShowNotes relative'>
			<button
				type='button'
				className={clsx(
					'flex items-center justify-center bg-dark/50 border border-mid rounded text-sm text-center w-10 h-10 px-2 py-1 transition-colors hover:bg-dark/70',
					open && 'ring-2 ring-primary',
				)}
				title='Show note subdivisions'
				onClick={() => setOpen((prev) => !prev)}
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
						onChange={(i) => setSubdivisionLevel(indexToLevel(i))}
					/>
					<ClickOutsideGuard
						wrapperRef={wrapperRef}
						onClickOutside={handleClickOutside}
					/>
				</>
			)}
		</div>
	);
}
