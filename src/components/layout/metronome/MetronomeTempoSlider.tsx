import { useMetronomeTempo } from '@/contexts';
import { BPM_INPUT_STEP } from '@/lib/metronome-defaults';
import { tempoTickValues } from '@/lib/metronome-tempo';
import { BEATS_PER_MINUTE, setTempoTitle } from '@/lib/ui-copy';
import { TickedRangeInput } from '../TickedRangeInput';
import { MetronomeTempoInput } from './MetronomeTempoInput';

/** Tempo slider + numeric input — tempo context only (not beat flash). */
export function MetronomeTempoSlider() {
	const { tempo, tempoMin, tempoMax, handleTempoChange } = useMetronomeTempo();
	const ticks = tempoTickValues(tempoMin, tempoMax);

	return (
		<div className='Tempo flex gap-2 items-center w-full min-w-0'>
			<TickedRangeInput
				min={tempoMin}
				max={tempoMax}
				step={BPM_INPUT_STEP}
				value={tempo}
				ticks={ticks}
				title={setTempoTitle(tempo)}
				ariaLabel={BEATS_PER_MINUTE}
				onChange={handleTempoChange}
			/>
			<MetronomeTempoInput
				tempo={tempo}
				tempoMin={tempoMin}
				tempoMax={tempoMax}
				onTempoChange={handleTempoChange}
			/>
		</div>
	);
}
