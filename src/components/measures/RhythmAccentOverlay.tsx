import { MEASURE_LENGTH } from '@/types';
import { RhythmAccentMark } from './RhythmAccentMark';
import type { NotationLayoutSlot, NotationStep } from '@/lib/notation';

type RhythmAccentOverlayProps = {
	steps: NotationStep[];
	layout: ReadonlyMap<number, NotationLayoutSlot>;
	show: boolean;
};

export function RhythmAccentOverlay({
	steps,
	layout,
	show,
}: RhythmAccentOverlayProps) {
	if (!show) {
		return null;
	}

	const unit = 100 / MEASURE_LENGTH;

	return (
		<div
			className='RhythmAccentOverlay pointer-events-none absolute inset-x-0 bottom-full h-3'
			aria-hidden
		>
			{steps.map((step) => {
				if (!step.hit || !step.accent) return null;
				const slot = layout.get(step.stepIndex);
				if (!slot) return null;
				return (
					<span
						key={step.stepIndex}
						className='absolute bottom-0'
						style={{
							left: `${slot.stemX * unit}%`,
							transform: 'translateX(-50%)',
						}}
					>
						<RhythmAccentMark />
					</span>
				);
			})}
		</div>
	);
}
