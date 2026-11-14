import { useId } from 'react';
import { rangeTickOffsetPercent } from '@/lib/range-ticks';

type TickedRangeInputProps = {
	min: number;
	max: number;
	step: number;
	value: number;
	/** Landmark values along the track (endpoints + interior ticks). */
	ticks: readonly number[];
	title: string;
	ariaLabel: string;
	onChange: (value: number) => void;
};

const TICKS_ROW_CLASS =
	'RangeTicks relative z-0 h-2 mx-[calc(var(--range-thumb-size)/2)] mt-[calc((var(--range-thumb-size)-0.5rem)/2)]';
const TICK_MARK_CLASS = 'absolute top-0 h-2 w-px -translate-x-1/2 bg-mid';

/**
 * Stepped range with half-thumb–aligned tick marks under the track.
 * Thumb centers travel between half-thumb and (width − half-thumb); the tick
 * row uses the same inset so 0%/100% match min/max.
 */
export function TickedRangeInput({
	min,
	max,
	step,
	value,
	ticks,
	title,
	ariaLabel,
	onChange,
}: TickedRangeInputProps) {
	const listId = useId();

	return (
		<div className='TickedRangeInput relative flex flex-col flex-auto min-w-0'>
			<input
				type='range'
				className='relative z-10 cursor-pointer w-full'
				min={min}
				max={max}
				step={step}
				list={listId}
				title={title}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				aria-label={ariaLabel}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
			/>
			<datalist id={listId}>
				{ticks.map((tick) => (
					<option key={tick} value={tick} />
				))}
			</datalist>
			<div className={TICKS_ROW_CLASS} aria-hidden='true'>
				{ticks.map((tick) => (
					<span
						key={tick}
						className={TICK_MARK_CLASS}
						style={{ left: `${rangeTickOffsetPercent(tick, min, max)}%` }}
					/>
				))}
			</div>
		</div>
	);
}
