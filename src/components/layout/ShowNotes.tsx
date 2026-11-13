import { useCallback } from 'react';
import { useSubdivision } from '@/contexts';
import { useArrowKeyCapture } from '@/hooks/useArrowKeyCapture';
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

	const onLeft = useCallback(() => {
		setSubdivisionLevel(indexToLevel(value - 1));
	}, [setSubdivisionLevel, value]);

	const onRight = useCallback(() => {
		setSubdivisionLevel(indexToLevel(value + 1));
	}, [setSubdivisionLevel, value]);

	useArrowKeyCapture(open, { onLeft, onRight });

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
