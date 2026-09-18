import { DIFFICULTY_MAX, DIFFICULTY_MIN } from '@/lib';

type DifficultySliderProps = {
	value: number;
	onChange: (value: number) => void;
	/** Show the numeric value beside the track. Default true. */
	showValue?: boolean;
};

export function DifficultySlider({
	value,
	onChange,
	showValue = true,
}: DifficultySliderProps) {
	return (
		<div className='DifficultySlider flex items-center gap-4'>
			<input
				type='range'
				className='w-full'
				min={DIFFICULTY_MIN}
				max={DIFFICULTY_MAX}
				step={1}
				title='Difficulty'
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				aria-label='Difficulty'
				aria-valuemin={DIFFICULTY_MIN}
				aria-valuemax={DIFFICULTY_MAX}
				aria-valuenow={value}
			/>
			{showValue ? (
				<span className='tabular-nums font-bold'>{value}</span>
			) : null}
		</div>
	);
}
