import { MeasureGrid } from '@/components/measures';
import type { ReactNode } from 'react';
import type { MeasureDisplayOptions } from '@/components/measures';
import type { RhythmMeasure } from '@/types';

const TUTORIAL_DISPLAY: MeasureDisplayOptions = {
	renderMode: 'grid',
	subdivisionLevel: 'quarters',
	showVisualFeedback: true,
	showAccents: false,
	showSticking: false,
	isMeasuresPlaying: false,
	subdivisionIndex: 0,
};

type IntroTutorialMeasureProps = {
	measure: RhythmMeasure;
	children?: ReactNode;
};

/** Always quarters, regardless of the student’s ShowNotes setting. */
export function IntroTutorialMeasure({
	measure,
	children,
}: IntroTutorialMeasureProps) {
	return (
		<div className='IntroTutorialMeasure relative grid-quarters'>
			<MeasureGrid measure={measure} display={TUTORIAL_DISPLAY} />
			{children}
		</div>
	);
}
