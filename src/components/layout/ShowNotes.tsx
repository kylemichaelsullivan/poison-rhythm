import { useEffect } from 'react';
import { useSubdivision } from '@/contexts';
import { useHoverPinPopover } from '@/hooks/useHoverPinPopover';
import { durationInfoForLevel } from '@/lib/notation';
import { indexToLevel, levelToIndex } from '@/lib/subdivision-levels';
import { ClickOutside } from './ClickOutside';
import { ShowNotesSlider } from './ShowNotesSlider';
import { ShowNotesTrigger } from './ShowNotesTrigger';
import type { NotationDuration } from '@/lib/notation';

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
	const { duration } = durationInfoForLevel(subdivisionLevel);
	const triggerDuration = duration as Extract<
		NotationDuration,
		'quarter' | 'eighth' | 'sixteenth'
	>;

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
				duration={triggerDuration}
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
