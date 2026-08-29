import type { NotationStep } from '@/lib/notation';
import { cellPositionPercent } from '@/lib/subdivision-playback';
import { MEASURE_LENGTH } from '@/types';
import { RhythmStickingLabel } from './RhythmStickingLabel';

type RhythmStickingOverlayProps = {
	steps: NotationStep[];
	show: boolean;
};

export function RhythmStickingOverlay({
	steps,
	show,
}: RhythmStickingOverlayProps) {
	if (!show) {
		return null;
	}

	return (
		<div
			className='RhythmStickingOverlay pointer-events-none absolute inset-x-0 top-full h-4'
			aria-hidden
		>
			{steps.map((step) =>
				step.hit && step.sticking && step.startCell !== undefined ? (
					<span
						key={step.stepIndex}
						className='absolute top-0.5'
						style={{
							left: `${cellPositionPercent(step.startCell, MEASURE_LENGTH)}%`,
							transform: 'translateX(-50%)',
						}}
					>
						<RhythmStickingLabel hand={step.sticking} />
					</span>
				) : null,
			)}
		</div>
	);
}
