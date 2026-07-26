import { SkipLink } from '@/components/layout/SkipLink';
import { useMetronome } from '@/contexts';
import { useTapTempo } from '@/hooks';
import { MetronomeControlBar } from './MetronomeControlBar';
import { MetronomeTapTempo } from './MetronomeTapTempo';

export function Metronome() {
	const { tempo, isMetronomeRunning, toggleMetronome, handleTempoChange } =
		useMetronome();
	const { onTap } = useTapTempo();

	return (
		<div className='Metronome flex flex-col gap-4 w-modal-inset max-w-3xl self-center'>
			<SkipLink targetId='beat-selector'>Skip to Beat Selector</SkipLink>
			<MetronomeControlBar
				tempo={tempo}
				isRunning={isMetronomeRunning}
				onToggle={toggleMetronome}
				onTempoChange={handleTempoChange}
			/>
			<MetronomeTapTempo onTap={onTap} />
		</div>
	);
}
