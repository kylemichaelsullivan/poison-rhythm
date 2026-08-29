import { BPM_INPUT_STEP, BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { MetronomeTempoInput } from './MetronomeTempoInput';

type MetronomeTempoSliderProps = {
	tempo: number;
	onTempoChange: (value: number) => void;
};

export function MetronomeTempoSlider({
	tempo,
	onTempoChange,
}: MetronomeTempoSliderProps) {
	return (
		<div className='Tempo flex gap-2 items-center w-full'>
			<input
				type='range'
				className='cursor-pointer flex-auto'
				min={BPM_MIN}
				max={BPM_MAX}
				step={BPM_INPUT_STEP}
				title='Set Tempo'
				value={tempo}
				onChange={(e) => onTempoChange(Number(e.target.value))}
				aria-label='Beats per Minute'
				aria-valuemin={BPM_MIN}
				aria-valuemax={BPM_MAX}
				aria-valuenow={tempo}
			/>
			<MetronomeTempoInput tempo={tempo} onTempoChange={onTempoChange} />
		</div>
	);
}
