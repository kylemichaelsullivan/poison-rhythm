import { useSettings } from '@/contexts';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureGrid } from './MeasureGrid';

type MeasureHeightReserveProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
};

/**
 * Reserves height for the active display mode so StableContentFrame
 * matches visible content without leaving empty dead space.
 */
export function MeasureHeightReserve({
	measure,
	richMeasure,
}: MeasureHeightReserveProps) {
	const { settings } = useSettings();
	const renderMode =
		settings.rhythmRenderMode === 'scroll' ? 'grid' : settings.rhythmRenderMode;

	return (
		<div className='MeasureHeightReserve w-full'>
			<MeasureGrid
				measure={measure}
				richMeasure={richMeasure}
				renderMode={renderMode}
			/>
		</div>
	);
}
