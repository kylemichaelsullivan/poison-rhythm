import { NotationStemMarksOverlay } from './NotationStemMarksOverlay';
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
	return (
		<NotationStemMarksOverlay
			steps={steps}
			layout={layout}
			show={show}
			className='RhythmStickingOverlay pointer-events-none absolute inset-x-0 top-full h-4'
			markClassName='absolute top-0.5'
			predicate={(step) => Boolean(step.hit && step.sticking)}
			renderMark={(step) =>
				step.sticking ? <RhythmStickingLabel hand={step.sticking} /> : null
			}
		/>
	);
}
