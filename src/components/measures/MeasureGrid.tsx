import clsx from 'clsx';
import { lazy, Suspense, useEffect } from 'react';
import { useSettings } from '@/contexts';
import { loadMusiSyncFont } from '@/lib/notation';
import type { RhythmRenderMode } from '@/lib/settings-schema';
import { shouldShowSticking } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureCell } from './MeasureCell';
import {
	type MeasurePlaybackPhase,
	measureBeatGroupClass,
	measureShellClass,
} from './measure-phase-chrome';

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

function MeasureCellGrid({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	phase,
}: MeasureGridProps) {
	const { settings } = useSettings();
	const showSticking = shouldShowSticking(settings);

	const beats = [0, 1, 2, 3] as const;

	return (
		<div
			className={clsx(
				'MeasureCellGrid grid grid-cols-2 gap-2 w-full p-2 sm:grid-cols-4 sm:gap-2.5',
				measureShellClass(phase),
				showSticking && 'pb-4',
			)}
		>
			{beats.map((beat) => {
				const start = beat * 4;
				return (
					<div
						className={clsx(
							'MeasureBeatGroup grid grid-cols-4 gap-px overflow-hidden rounded-md p-px',
							measureBeatGroupClass(phase),
						)}
						data-beat={beat + 1}
						key={beat}
					>
						{measure.slice(start, start + 4).map((cell, offset) => {
							const i = start + offset;
							const step = richMeasure?.[i];
							return (
								<MeasureCell
									value={cell}
									playback={playback}
									index={i}
									accent={step?.accent}
									sticking={step?.sticking}
									hidden={hidden}
									phase={phase}
									key={`${i}-${cell}`}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}

/** Notation-shaped shell shown while the lazy notation chunk loads. */
function NotationFallback({
	hidden = false,
	phase,
}: {
	hidden?: boolean;
	phase?: MeasurePlaybackPhase;
}) {
	return (
		<output
			className={clsx(
				'MeasureNotation relative flex w-full items-center justify-center px-3 py-4',
				measureShellClass(phase),
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
	phase,
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
		/>
	);
}
