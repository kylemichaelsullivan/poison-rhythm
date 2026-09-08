import clsx from 'clsx';
import { lazy, Suspense, useEffect } from 'react';
import { useSettings } from '@/contexts';
import { loadMusiSyncFont } from '@/lib/notation';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { shouldShowSticking } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCell } from '.';

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

/** Notation-shaped shell shown while the lazy notation chunk loads. */
function NotationFallback({ hidden = false }: { hidden?: boolean }) {
	return (
		<output
			className={clsx(
				'MeasureNotation relative flex w-full items-center justify-center border border-mid rounded-lg px-3 py-4',
				hidden && 'opacity-0',
			)}
			aria-live='polite'
			aria-busy='true'
		>
			<span className='text-sm text-muted'>Loading Rhythm…</span>
		</output>
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

	useEffect(() => {
		if (renderMode !== 'notation') return;
		void measureNotationImport();
		void loadMusiSyncFont();
	}, [renderMode]);

	if (renderMode === 'notation') {
		return (
			<Suspense fallback={<NotationFallback hidden={hidden} />}>
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
