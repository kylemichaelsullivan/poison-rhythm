import clsx from 'clsx';
import type { RefObject } from 'react';
import { controlSurfaceBaseClassName } from '@/lib/control-classes';
import { SUBDIVISION_LABELS } from '@/lib/subdivision-levels';

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
				'ShowNotesSlider absolute shadow-lg w-40 left-0 top-full z-10 px-3 py-3 translate-y-1',
				controlSurfaceBaseClassName,
			)}
			role='dialog'
			aria-label='Note Subdivisions'
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<input
				type='range'
				className='w-full'
				min={0}
				max={2}
				step={1}
				value={value}
				aria-label='Note Subdivisions'
				aria-valuemin={0}
				aria-valuemax={2}
				aria-valuenow={value}
				aria-valuetext={SUBDIVISION_LABELS[value]}
				onChange={(e) => onChange(Number(e.target.value))}
				ref={inputRef}
			/>
			<div className='flex justify-between text-xs pt-1'>
				{SUBDIVISION_LABELS.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
		</div>
	);
}
