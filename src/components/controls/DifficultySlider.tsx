import { usePendingDifficulty } from '@/contexts';
import { DIFFICULTY_MAX, DIFFICULTY_MIN } from '@/lib';

type DifficultySliderProps = {
	/** Show the numeric value beside the track. Default true. */
	showValue?: boolean;
};

/**
 * Difficulty 1–5 — drafts via PendingDifficulty until the host modal closes.
 */
export function DifficultySlider({ showValue = true }: DifficultySliderProps) {
	const { sliderValue, onDifficultyChange } = usePendingDifficulty();

	return (
		<div className='DifficultySlider flex items-center gap-4'>
			<input
				type='range'
				className='w-full'
				min={DIFFICULTY_MIN}
				max={DIFFICULTY_MAX}
				step={1}
				title='Difficulty'
				value={sliderValue}
				onChange={(e) => onDifficultyChange(Number(e.target.value))}
				aria-label='Difficulty'
				aria-valuemin={DIFFICULTY_MIN}
				aria-valuemax={DIFFICULTY_MAX}
				aria-valuenow={sliderValue}
			/>
			{showValue ? (
				<span className='tabular-nums font-bold'>{sliderValue}</span>
			) : null}
		</div>
	);
}
