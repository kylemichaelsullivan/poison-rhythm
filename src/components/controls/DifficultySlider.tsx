type DifficultySliderProps = {
	value: number;
	onChange: (value: number) => void;
};

export function DifficultySlider({ value, onChange }: DifficultySliderProps) {
	const min = 1;
	const max = 5;
	const step = 1;

	return (
		<div className='DifficultySlider flex items-center gap-4'>
			<input
				type='range'
				className='appearance-none accent-primary bg-white rounded-lg w-full h-2'
				min={min}
				max={max}
				step={step}
				value={value}
				title='Difficulty'
				onChange={(e) => onChange(Number(e.target.value))}
			/>
			<span className='tabular-nums text-white'>{value}</span>
		</div>
	);
}
