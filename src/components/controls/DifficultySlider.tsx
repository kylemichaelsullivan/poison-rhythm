import { TickedRangeInput } from '@/components/layout';
import { usePendingDifficulty } from '@/contexts';
import { DIFFICULTY_MAX, DIFFICULTY_MIN, inclusiveRangeTicks } from '@/lib';

type DifficultySliderProps = {
	/** Show the numeric value beside the track. Default true. */
	showValue?: boolean;
};

const DIFFICULTY_TICKS = inclusiveRangeTicks(DIFFICULTY_MIN, DIFFICULTY_MAX);

/**
 * Difficulty 1–5 — drafts via PendingDifficulty until the host modal closes.
 */
export function DifficultySlider({ showValue = true }: DifficultySliderProps) {
	const { sliderValue, onDifficultyChange } = usePendingDifficulty();

	return (
		<div className='DifficultySlider flex items-center gap-4'>
			<TickedRangeInput
				min={DIFFICULTY_MIN}
				max={DIFFICULTY_MAX}
				step={1}
				value={sliderValue}
				ticks={DIFFICULTY_TICKS}
				title={`Set Difficulty (Level ${sliderValue})`}
				ariaLabel={`Difficulty Level ${sliderValue}`}
				onChange={onDifficultyChange}
			/>
			{showValue ? (
				<span className='tabular-nums font-bold'>{sliderValue}</span>
			) : null}
		</div>
	);
}
