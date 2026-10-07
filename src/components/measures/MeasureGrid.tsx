import { lazy, Suspense } from 'react';
import { useSettings } from '@/contexts';
import { useNotationPrefetch } from '@/hooks/useNotationPrefetch';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { shouldShowSticking } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCellGrid } from './MeasureCellGrid';
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
	/** Override settings render mode (e.g. height reserve always measures grid). */
	renderMode?: RhythmRenderMode;
	/** Live playback chrome (Listening = secondary, Playing = primary). */
	phase?: MeasurePlaybackPhase;
};

export function MeasureGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	renderMode: renderModeProp,
	phase,
}: MeasureGridProps) {
	const { settings } = useSettings();
	const renderMode = renderModeProp ?? settings.rhythmRenderMode;
	const showSticking = shouldShowSticking(settings);

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
			showSticking={showSticking}
		/>
	);
}
