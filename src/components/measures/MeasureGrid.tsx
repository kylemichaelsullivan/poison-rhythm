import clsx from 'clsx';
import { lazy, Suspense } from 'react';
import { useSettings } from '@/contexts';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { shouldShowSticking } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCell } from '.';

const MeasureNotation = lazy(() =>
	import('./MeasureNotation').then((module) => ({
		default: module.MeasureNotation,
	})),
);

type MeasureGridProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	playback?: boolean;
	hidden?: boolean;
	/** Override settings render mode (e.g. height reserve always measures grid). */
	renderMode?: RhythmRenderMode;
};

function MeasureCellGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
}: MeasureGridProps) {
	const { settings } = useSettings();
	const showSticking = shouldShowSticking(settings);

	return (
		<div
			className={clsx(
				'MeasureCellGrid grid grid-cols-16 gap-1 w-full border border-mid rounded-lg p-2',
				showSticking && 'pb-4',
			)}
		>
			{measure.map((cell, i) => {
				const step = richMeasure?.[i];
				return (
					<MeasureCell
						value={cell}
						playback={playback}
						index={i}
						accent={step?.accent}
						sticking={step?.sticking}
						hidden={hidden}
						key={`${i}-${cell}`}
					/>
				);
			})}
		</div>
	);
}

function NotationFallback({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
}: MeasureGridProps) {
	return (
		<MeasureCellGrid
			measure={measure}
			richMeasure={richMeasure}
			playback={playback}
			hidden={hidden}
		/>
	);
}

export function MeasureGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	renderMode: renderModeProp,
}: MeasureGridProps) {
	const { settings } = useSettings();
	const renderMode = renderModeProp ?? settings.rhythmRenderMode;

	if (renderMode === 'notation') {
		return (
			<Suspense
				fallback={
					<NotationFallback
						measure={measure}
						richMeasure={richMeasure}
						playback={playback}
						hidden={hidden}
					/>
				}
			>
				<MeasureNotation
					measure={measure}
					richMeasure={richMeasure}
					playback={playback}
					hidden={hidden}
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
		/>
	);
}
