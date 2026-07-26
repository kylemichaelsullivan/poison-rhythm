import MetronomeIcon from '@/assets/svg/metronome.svg?react';
import { useMetronome } from '@/contexts';
import { CornerModal } from '../CornerModal';
import { Metronome as MetronomeContent } from '../metronome/Metronome';

export function Metronome() {
	const { tempo } = useMetronome();

	return (
		<CornerModal
			icon={MetronomeIcon}
			label={`Change Tempo (${tempo} BPM)`}
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
			<MetronomeContent />
		</CornerModal>
	);
}
