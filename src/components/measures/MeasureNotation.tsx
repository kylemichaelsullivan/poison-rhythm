import clsx from 'clsx';
import { useMusiSyncFont } from '@/hooks/useMusiSyncFont';
import {
	measureToNotationSteps,
	notationStepsToGlyphString,
} from '@/lib/notation';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureNotationGlyph } from './MeasureNotationGlyph';
import type { MeasureDisplayOptions } from './measure-display-options';
import {
	type MeasurePlaybackPhase,
	measureShellClass,
} from './measure-phase-chrome';
import { NotationPlaybackCursor } from './NotationPlaybackCursor';
import { RhythmAccentOverlay } from './RhythmAccentOverlay';
import { RhythmStickingOverlay } from './RhythmStickingOverlay';

type MeasureNotationProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	playback?: boolean;
	hidden?: boolean;
	phase?: MeasurePlaybackPhase;
	display: MeasureDisplayOptions;
};

export function MeasureNotation({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
	phase,
	display,
}: MeasureNotationProps) {
	const { ready: fontReady } = useMusiSyncFont();
	const steps = measureToNotationSteps(
		measure,
		richMeasure,
		display.subdivisionLevel,
	);
	const glyphString = notationStepsToGlyphString(steps);
	const stepCount = Math.max(steps.length, 1);
	const { showAccents, showSticking } = display;

	return (
		<div
			className={clsx(
				'MeasureNotation relative w-full px-3 py-4',
				measureShellClass(phase),
				showSticking && 'pb-4',
				showAccents && 'pt-6',
				hidden && 'opacity-0',
			)}
		>
			<RhythmAccentOverlay
				steps={steps}
				stepCount={stepCount}
				show={showAccents && fontReady}
			/>
			<div className='relative w-full'>
				<NotationPlaybackCursor
					playback={playback}
					hidden={hidden || !fontReady}
					showVisualFeedback={display.showVisualFeedback}
					isMeasuresPlaying={display.isMeasuresPlaying}
				/>
				<section
					// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users must focus horizontal overflow
					tabIndex={0}
					className={clsx(
						'MeasureNotationLine MusiSync text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
						!fontReady && 'invisible',
					)}
					aria-label='Rhythm Notation'
					data-glyphs={glyphString}
				>
					{steps.map((step) => (
						<MeasureNotationGlyph key={step.stepIndex} glyph={step.glyph} />
					))}
				</section>
			</div>
			<RhythmStickingOverlay steps={steps} show={showSticking && fontReady} />
		</div>
	);
}
