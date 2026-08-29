import type { NotationStep } from '@/lib/notation';
import { RhythmAccentMark } from './RhythmAccentMark';

type RhythmAccentOverlayProps = {
	steps: NotationStep[];
	stepCount: number;
	show: boolean;
};

export function RhythmAccentOverlay({
	steps,
	stepCount,
	show,
}: RhythmAccentOverlayProps) {
	if (!show) {
		return null;
	}

	return (
		<div
			className='RhythmAccentOverlay pointer-events-none absolute inset-x-0 bottom-full h-3'
			aria-hidden
		>
			{steps.map((step) =>
				step.hit && step.accent ? (
					<span
						key={step.stepIndex}
						className='absolute bottom-0'
						style={{
							left: `${((step.stepIndex + 0.5) / stepCount) * 100}%`,
							transform: 'translateX(-50%)',
						}}
					>
						<RhythmAccentMark />
					</span>
				) : null,
			)}
		</div>
	);
}
