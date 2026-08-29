import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { CurrentMeasureDisplay } from './CurrentMeasureDisplay';

type NextMeasurePreviewProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
};

export function NextMeasurePreview({
	measure,
	richMeasure,
}: NextMeasurePreviewProps) {
	return (
		<div
			className='NextMeasurePreview w-full opacity-35'
			data-testid='next-measure'
		>
			<span className='sr-only'>Next measure</span>
			<CurrentMeasureDisplay measure={measure} richMeasure={richMeasure} />
		</div>
	);
}
