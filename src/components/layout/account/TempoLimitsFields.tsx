import { useTempoPreference } from '@/contexts';
import { BPM_INPUT_STEP, BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { TEMPO_MAX_LABEL, TEMPO_MIN_LABEL } from '@/lib/ui-copy';
import { TickedRangeInput } from '../TickedRangeInput';

export function TempoLimitsFields() {
	const { tempoMin, tempoMax, setTempoMin, setTempoMax } = useTempoPreference();

	return (
		<div className='TempoLimitsFields flex flex-col gap-3'>
			<p className='text-sm text-muted'>
				Students can’t set the metronome outside this range on this profile.
			</p>
			<div className='flex flex-col gap-1.5'>
				<span className='text-sm font-medium text-dark'>{TEMPO_MIN_LABEL}</span>
				<TickedRangeInput
					min={BPM_MIN}
					max={BPM_MAX}
					step={BPM_INPUT_STEP}
					value={tempoMin}
					ticks={[BPM_MIN, 100, 150, BPM_MAX]}
					title={`${TEMPO_MIN_LABEL} (${tempoMin} BPM)`}
					ariaLabel={TEMPO_MIN_LABEL}
					onChange={setTempoMin}
				/>
			</div>
			<div className='flex flex-col gap-1.5'>
				<span className='text-sm font-medium text-dark'>{TEMPO_MAX_LABEL}</span>
				<TickedRangeInput
					min={BPM_MIN}
					max={BPM_MAX}
					step={BPM_INPUT_STEP}
					value={tempoMax}
					ticks={[BPM_MIN, 100, 150, BPM_MAX]}
					title={`${TEMPO_MAX_LABEL} (${tempoMax} BPM)`}
					ariaLabel={TEMPO_MAX_LABEL}
					onChange={setTempoMax}
				/>
			</div>
		</div>
	);
}
