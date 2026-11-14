import clsx from 'clsx';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
import { NOTE_SUBDIVISIONS_LABEL } from '@/lib/ui-copy';
import { SubdivisionRangeInput } from './SubdivisionRangeInput';
import type { RefObject } from 'react';

type ShowNotesSliderPlacement = 'below-start' | 'above-end';

type ShowNotesSliderProps = {
	value: number;
	onChange: (index: number) => void;
	inputRef?: RefObject<HTMLInputElement | null>;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	/** Header opens below-start; Difficulty help opens above-end. */
	placement?: ShowNotesSliderPlacement;
};

const PLACEMENT_CLASS: Record<ShowNotesSliderPlacement, string> = {
	'below-start': 'left-0 top-full translate-y-1',
	'above-end': 'right-0 bottom-full -translate-y-1',
};

export function ShowNotesSlider({
	value,
	onChange,
	inputRef,
	onMouseEnter,
	onMouseLeave,
	placement = 'below-start',
}: ShowNotesSliderProps) {
	return (
		<div
			className={clsx(
				'ShowNotesSlider absolute z-10 w-40 px-3 py-3',
				PLACEMENT_CLASS[placement],
				controlSurfaceBaseClassName,
			)}
			role='dialog'
			aria-label={NOTE_SUBDIVISIONS_LABEL}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<SubdivisionRangeInput
				value={value}
				onChange={onChange}
				inputRef={inputRef}
			/>
		</div>
	);
}
