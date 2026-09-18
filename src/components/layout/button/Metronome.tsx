import { lazy, Suspense } from 'react';
import MetronomeIcon from '@/assets/svg/metronome.svg?react';
import { useMetronome, usePlaybackPreferences } from '@/contexts';
import { CornerModal } from '../CornerModal';

const MetronomeContent = lazy(() =>
	import('../metronome/Metronome').then((module) => ({
		default: module.Metronome,
	})),
);

export function Metronome() {
	const { tempo } = useMetronome();
	const { muteMetronome, setMuteMetronome } = usePlaybackPreferences();
	const muteAction = muteMetronome ? 'Unmute' : 'Mute';

	return (
		<CornerModal
			icon={MetronomeIcon}
			label={`Change Tempo (${tempo} BPM)`}
			buttonTitle={`Change Tempo (${tempo} BPM). Double-Click to ${muteAction} Metronome`}
			buttonClassName={muteMetronome ? 'border-dashed text-mid' : undefined}
			onDoubleClick={() => setMuteMetronome(!muteMetronome)}
			detail={
				<span
					className='MetronomeBpm flex items-baseline gap-1 pr-0.5 leading-none'
					aria-hidden='true'
				>
					<span className='text-sm font-semibold tabular-nums tracking-tight'>
						{tempo}
					</span>
					<span className='hidden text-xs font-medium uppercase tracking-widest sm:inline'>
						bpm
					</span>
				</span>
			}
			fullWidth
			lazy
		>
			<Suspense fallback={null}>
				<MetronomeContent />
			</Suspense>
		</CornerModal>
	);
}
