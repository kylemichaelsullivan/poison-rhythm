import { SUBDIVISION_LABELS } from '@/lib/subdivision-levels';

type ShowNotesSliderProps = {
	value: number;
	onChange: (index: number) => void;
};

export function ShowNotesSlider({ value, onChange }: ShowNotesSliderProps) {
	return (
		<div
			className='ShowNotesSlider absolute bg-dark border border-mid rounded shadow-lg w-40 left-0 top-full z-10 px-3 py-3 translate-y-1'
			role='dialog'
			aria-label='Note subdivisions'
		>
			<input
				type='range'
				className='slider w-full accent-primary'
				min={0}
				max={2}
				step={1}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				aria-valuemin={0}
				aria-valuemax={2}
				aria-valuenow={value}
				aria-valuetext={SUBDIVISION_LABELS[value]}
			/>
			<div className='flex justify-between text-xs text-mid pt-1'>
				{SUBDIVISION_LABELS.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
		</div>
	);
}
