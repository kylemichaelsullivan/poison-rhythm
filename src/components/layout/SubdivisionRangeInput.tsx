import { SUBDIVISION_LABELS } from '@/lib/subdivision-levels';
import { NOTE_SUBDIVISIONS_LABEL, noteSubdivisionsTitle } from '@/lib/ui-copy';
import type { RefObject } from 'react';

type SubdivisionRangeInputProps = {
	value: number;
	onChange: (index: number) => void;
	inputRef?: RefObject<HTMLInputElement | null>;
	/** Extra class on the tick labels row (e.g. text-muted in Settings). */
	ticksClassName?: string;
};

/** Shared subdivision range + tick labels for ShowNotes and Settings. */
export function SubdivisionRangeInput({
	value,
	onChange,
	inputRef,
	ticksClassName = 'flex justify-between text-xs pt-1',
}: SubdivisionRangeInputProps) {
	const tick = SUBDIVISION_LABELS[value];

	return (
		<>
			<input
				type='range'
				className='w-full'
				min={0}
				max={2}
				step={1}
				value={value}
				title={noteSubdivisionsTitle(tick)}
				aria-label={NOTE_SUBDIVISIONS_LABEL}
				aria-valuemin={0}
				aria-valuemax={2}
				aria-valuenow={value}
				aria-valuetext={tick}
				onChange={(e) => onChange(Number(e.target.value))}
				ref={inputRef}
			/>
			<div className={ticksClassName}>
				{SUBDIVISION_LABELS.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
		</>
	);
}
