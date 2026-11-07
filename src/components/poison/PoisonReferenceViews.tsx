import { MeasureGrid } from '@/components/measures';
import { Stack } from '@/components/ui';
import { isScrollDisplayMode } from '@/lib/settings-schema';
import type { MeasureDisplayOptions } from '@/components/measures';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';

type PoisonReferenceViewsProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	display: MeasureDisplayOptions;
};

/**
 * Poison reference: single Grid / Notation view, or both stacked in Scroll
 * (highway stays on Measures).
 */
export function PoisonReferenceViews({
	measure,
	richMeasure,
	display,
}: PoisonReferenceViewsProps) {
	if (isScrollDisplayMode(display.renderMode)) {
		return (
			<div className='PoisonReferenceViews w-full'>
				<Stack gap='3'>
					<MeasureGrid
						measure={measure}
						richMeasure={richMeasure}
						renderMode='notation'
						display={display}
					/>
					<MeasureGrid
						measure={measure}
						richMeasure={richMeasure}
						renderMode='grid'
						display={display}
					/>
				</Stack>
			</div>
		);
	}

	return (
		<div className='PoisonReferenceViews w-full'>
			<MeasureGrid
				measure={measure}
				richMeasure={richMeasure}
				display={display}
			/>
		</div>
	);
}
