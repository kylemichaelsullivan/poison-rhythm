import { lazy, Suspense } from 'react';
import { useNotationPrefetch } from '@/hooks/useNotationPrefetch';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCellGrid } from './MeasureCellGrid';
import type { MeasureDisplayOptions } from './measure-display-options';
import type { MeasurePlaybackPhase } from './measure-phase-chrome';
import { NotationFallback } from './NotationFallback';

const measureNotationImport = () =>
	import('./MeasureNotation').then((module) => ({
		default: module.MeasureNotation,
	}));

const MeasureNotation = lazy(measureNotationImport);

type MeasureGridProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	playback?: boolean;
	hidden?: boolean;
	/** Override display render mode (e.g. height reserve always measures grid). */
	renderMode?: RhythmRenderMode;
	/** Live playback chrome (Listening = secondary, Playing = primary). */
	phase?: MeasurePlaybackPhase;
	display: MeasureDisplayOptions;
};

export function MeasureGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	renderMode: renderModeProp,
	phase,
	display,
}: MeasureGridProps) {
	const renderMode = renderModeProp ?? display.renderMode;

	useNotationPrefetch(renderMode, measureNotationImport);

	if (renderMode === 'notation') {
		return (
			<Suspense fallback={<NotationFallback hidden={hidden} phase={phase} />}>
				<MeasureNotation
					measure={measure}
					richMeasure={richMeasure}
					playback={playback}
					hidden={hidden}
					phase={phase}
					display={display}
				/>
			</Suspense>
		);
	}

	return (
		<MeasureCellGrid
			measure={measure}
			richMeasure={richMeasure}
			playback={playback}
			hidden={hidden}
			phase={phase}
			display={display}
		/>
	);
}
