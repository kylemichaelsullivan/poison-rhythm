import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';
import type { MeasureDisplayOptions } from './measure-display-options';

type NextMeasurePreviewProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	display: MeasureDisplayOptions;
};

export function NextMeasurePreview({
	measure,
	richMeasure,
	display,
}: NextMeasurePreviewProps) {
	return (
		<div
			className='NextMeasurePreview w-full opacity-35'
			data-testid='next-measure'
		>
			<span className='sr-only'>Next measure</span>
			<CurrentMeasureDisplay
				measure={measure}
				richMeasure={richMeasure}
				display={display}
			/>
		</div>
	);
}
