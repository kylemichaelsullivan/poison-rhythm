import { useEffect } from 'react';
import { useSubdivision } from '@/contexts';
import { useHoverPinPopover } from '@/hooks/useHoverPinPopover';
import {
	indexToLevel,
	levelToIndex,
	SUBDIVISION_LABELS,
} from '@/lib/subdivision-levels';
import { ClickOutside } from './ClickOutside';
import { ShowNotesSlider } from './ShowNotesSlider';
import { ShowNotesTrigger } from './ShowNotesTrigger';

export function ShowNotes() {
	const { subdivisionLevel, setSubdivisionLevel } = useSubdivision();
	const {
		open,
		wrapperRef,
		focusTargetRef,
		handleHoverOpen,
		handleMouseLeave,
		handleButtonClick,
		handleClickOutside,
		handleBlur,
		handleFocus,
	} = useHoverPinPopover();
	const value = levelToIndex(subdivisionLevel);

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

	return (
		<div className='ShowNotes relative' ref={wrapperRef}>
			<ShowNotesTrigger
				label={SUBDIVISION_LABELS[value]}
				open={open}
				onMouseEnter={handleHoverOpen}
				onMouseLeave={handleMouseLeave}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onClick={handleButtonClick}
			/>
			{open && (
				<>
					<ShowNotesSlider
						value={value}
						onMouseEnter={handleHoverOpen}
						onMouseLeave={handleMouseLeave}
						onChange={(i) => setSubdivisionLevel(indexToLevel(i))}
						inputRef={focusTargetRef}
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
