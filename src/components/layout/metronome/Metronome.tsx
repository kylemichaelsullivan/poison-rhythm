import { SkipLink } from '@/components/layout/SkipLink';
import { useTapTempo } from '@/hooks';
import { MetronomeControlBar } from './MetronomeControlBar';
import { MetronomeTapTempo } from './MetronomeTapTempo';

export function Metronome() {
	const { onTap } = useTapTempo();

	return (
		<div className='Metronome flex flex-col gap-4 w-full self-center'>
			<SkipLink targetId='beat-selector'>Skip to Beat Selector</SkipLink>
			<MetronomeTapTempo onTap={onTap} />
			<MetronomeControlBar />
		</div>
	);
}
