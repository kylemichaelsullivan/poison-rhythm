import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureGrid } from './MeasureGrid';
import type { MeasureDisplayOptions } from './measure-display-options';

type MeasureHeightReserveProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	display: MeasureDisplayOptions;
};

/**
 * Reserves height for the active display mode so StableContentFrame
 * matches visible content without leaving empty dead space.
 */
export function MeasureHeightReserve({
	measure,
	richMeasure,
	display,
}: MeasureHeightReserveProps) {
	return (
		<div className='MeasureHeightReserve w-full'>
			<MeasureGrid
				measure={measure}
				richMeasure={richMeasure}
				renderMode={display.renderMode}
				display={display}
			/>
		</div>
	);
}
