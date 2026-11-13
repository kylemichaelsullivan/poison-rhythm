import { NotationStemMarksOverlay } from './NotationStemMarksOverlay';
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
	return (
		<NotationStemMarksOverlay
			steps={steps}
			layout={layout}
			show={show}
			className='RhythmAccentOverlay pointer-events-none absolute inset-x-0 bottom-full h-3'
			markClassName='absolute bottom-0'
			predicate={(step) => Boolean(step.hit && step.accent)}
			renderMark={() => <RhythmAccentMark />}
		/>
	);
}
