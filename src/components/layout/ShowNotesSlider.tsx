import clsx from 'clsx';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
import { NOTE_SUBDIVISIONS_LABEL } from '@/lib/ui-copy';
import { SubdivisionRangeInput } from './SubdivisionRangeInput';
import type { RefObject } from 'react';

type ShowNotesSliderProps = {
	value: number;
	onChange: (index: number) => void;
	inputRef?: RefObject<HTMLInputElement | null>;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
};

export function ShowNotesSlider({
	value,
	onChange,
	inputRef,
	onMouseEnter,
	onMouseLeave,
}: ShowNotesSliderProps) {
	return (
		<div
			className={clsx(
				'ShowNotesSlider absolute w-40 left-0 top-full z-10 px-3 py-3 translate-y-1',
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
