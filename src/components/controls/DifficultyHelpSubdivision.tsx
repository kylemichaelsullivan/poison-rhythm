import { useCallback } from 'react';
import {
	ClickOutside,
	ShowNotesSlider,
	ShowNotesTrigger,
} from '@/components/layout';
import { useSubdivision } from '@/contexts';
import { useArrowKeyCapture } from '@/hooks/useArrowKeyCapture';
import { useHoverPinPopover } from '@/hooks/useHoverPinPopover';
import { durationInfoForLevel } from '@/lib/notation';
import { indexToLevel, levelToIndex } from '@/lib/subdivision-levels';
import type { NotationDuration } from '@/lib/notation';

/**
 * Show Notes control for Difficulty Levels help — same hover/click slider as
 * the header, anchored above the bottom-right glyph.
 */
export function DifficultyHelpSubdivision() {
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
		<div
			className='DifficultyHelpSubdivision relative flex justify-end'
			ref={wrapperRef}
		>
			<ShowNotesTrigger
				duration={triggerDuration}
				open={open}
				onMouseEnter={handleHoverOpen}
				onMouseLeave={handleMouseLeave}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onClick={handleButtonClick}
			/>
			{open ? (
				<>
					<ShowNotesSlider
						placement='above-end'
						value={value}
						onMouseEnter={handleHoverOpen}
						onMouseLeave={handleMouseLeave}
						onChange={(i) => setSubdivisionLevel(indexToLevel(i))}
						inputRef={focusTargetRef}
					/>
					<ClickOutside
						ignoreModalClicks={false}
						wrapperRef={wrapperRef}
						onClickOutside={handleClickOutside}
					/>
				</>
			) : null}
		</div>
	);
}
