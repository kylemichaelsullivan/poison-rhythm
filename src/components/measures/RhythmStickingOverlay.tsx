import { MEASURE_LENGTH } from '@/types';
import { RhythmStickingLabel } from './RhythmStickingLabel';
import type { NotationLayoutSlot, NotationStep } from '@/lib/notation';

type RhythmStickingOverlayProps = {
	steps: NotationStep[];
	layout: ReadonlyMap<number, NotationLayoutSlot>;
	show: boolean;
};

export function RhythmStickingOverlay({
	steps,
	layout,
	show,
}: RhythmStickingOverlayProps) {
	if (!show) {
		return null;
	}

	const unit = 100 / MEASURE_LENGTH;

	return (
		<div
			className='RhythmStickingOverlay pointer-events-none absolute inset-x-0 top-full h-4'
			aria-hidden
		>
			{steps.map((step) => {
				if (!step.hit || !step.sticking) return null;
				const slot = layout.get(step.stepIndex);
				if (!slot) return null;
				return (
					<span
						key={step.stepIndex}
						className='absolute top-0.5'
						style={{
							left: `${slot.stemX * unit}%`,
							transform: 'translateX(-50%)',
						}}
					>
						<RhythmStickingLabel hand={step.sticking} />
					</span>
				);
			})}
		</div>
	);
}
