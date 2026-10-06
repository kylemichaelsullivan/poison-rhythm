import { BPM_INPUT_STEP, BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { tempoTickValues } from '@/lib/metronome-tempo';
import { MetronomeTempoInput } from './MetronomeTempoInput';

type MetronomeTempoSliderProps = {
	tempo: number;
	onTempoChange: (value: number) => void;
};

const TEMPO_TICKS = tempoTickValues();
const TEMPO_DATALIST_ID = 'poison-rhythm-tempo-ticks';
const TEMPO_SPAN = BPM_MAX - BPM_MIN;

/** Map BPM → % along the thumb travel path (inset by half the thumb). */
function tickOffsetPercent(tick: number) {
	return ((tick - BPM_MIN) / TEMPO_SPAN) * 100;
}

export function MetronomeTempoSlider({
	tempo,
	onTempoChange,
}: MetronomeTempoSliderProps) {
	return (
		<div className='Tempo flex gap-2 items-center w-full min-w-0'>
			<div className='relative flex flex-col flex-auto min-w-0'>
				<input
					type='range'
					className='TempoSlider relative z-10 cursor-pointer w-full'
					min={BPM_MIN}
					max={BPM_MAX}
					step={BPM_INPUT_STEP}
					list={TEMPO_DATALIST_ID}
					title='Set Tempo'
					value={tempo}
					onChange={(e) => onTempoChange(Number(e.target.value))}
					aria-label='Beats per Minute'
					aria-valuemin={BPM_MIN}
					aria-valuemax={BPM_MAX}
					aria-valuenow={tempo}
				/>
				<datalist id={TEMPO_DATALIST_ID}>
					{TEMPO_TICKS.map((tick) => (
						<option key={tick} value={tick} />
					))}
				</datalist>
				{/*
				  Thumb centers travel between half-thumb and (width − half-thumb).
				  Inset the tick row by the same half-thumb so 0%/100% match min/max.
				  Sit ticks below the thumb overhang and under the input in paint order.
				*/}
				<div
					className='TempoTicks relative z-0 h-2 select-none mx-[calc(var(--range-thumb-size)/2)] mt-[calc((var(--range-thumb-size)-0.5rem)/2)]'
					aria-hidden='true'
				>
					{TEMPO_TICKS.map((tick) => (
						<span
							key={tick}
							className='absolute top-0 h-2 w-px -translate-x-1/2 bg-mid'
							style={{ left: `${tickOffsetPercent(tick)}%` }}
						/>
					))}
				</div>
			</div>
			<MetronomeTempoInput tempo={tempo} onTempoChange={onTempoChange} />
		</div>
	);
}
