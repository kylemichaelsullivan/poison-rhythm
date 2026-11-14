import { useMetronomeTempo } from '@/contexts';
import { BPM_INPUT_STEP, BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { tempoTickValues } from '@/lib/metronome-tempo';
import { BEATS_PER_MINUTE, setTempoTitle } from '@/lib/ui-copy';
import { TickedRangeInput } from '../TickedRangeInput';
import { MetronomeTempoInput } from './MetronomeTempoInput';

const TEMPO_TICKS = tempoTickValues();

/** Tempo slider + numeric input — tempo context only (not beat flash). */
export function MetronomeTempoSlider() {
	const { tempo, handleTempoChange } = useMetronomeTempo();

	return (
		<div className='Tempo flex gap-2 items-center w-full min-w-0'>
			<TickedRangeInput
				min={BPM_MIN}
				max={BPM_MAX}
				step={BPM_INPUT_STEP}
				value={tempo}
				ticks={TEMPO_TICKS}
				title={setTempoTitle(tempo)}
				ariaLabel={BEATS_PER_MINUTE}
				onChange={handleTempoChange}
			/>
			<MetronomeTempoInput tempo={tempo} onTempoChange={handleTempoChange} />
		</div>
	);
}
