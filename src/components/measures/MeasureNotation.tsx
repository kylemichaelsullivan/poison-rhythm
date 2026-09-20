import clsx from 'clsx';
import { useSettings, useSubdivision } from '@/contexts';
import { useMusiSyncFont } from '@/hooks/useMusiSyncFont';
import {
	measureToNotationSteps,
	notationStepsToGlyphString,
} from '@/lib/notation';
import { shouldShowAccents, shouldShowSticking } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import { MeasureNotationGlyph } from './MeasureNotationGlyph';
import { NotationPlaybackCursor } from './NotationPlaybackCursor';
import { RhythmAccentOverlay } from './RhythmAccentOverlay';
import { RhythmStickingOverlay } from './RhythmStickingOverlay';

type MeasureNotationProps = {
	measure: RhythmMeasure;
	richMeasure?: RichRhythmMeasure;
	playback?: boolean;
	hidden?: boolean;
};

export function MeasureNotation({
	measure,
	richMeasure,
	playback = false,
	hidden = false,
}: MeasureNotationProps) {
	const { subdivisionLevel } = useSubdivision();
	const { settings } = useSettings();
	const fontReady = useMusiSyncFont();
	const steps = measureToNotationSteps(measure, richMeasure, subdivisionLevel);
	const glyphString = notationStepsToGlyphString(steps);
	const stepCount = Math.max(steps.length, 1);
	const accentsEnabled = shouldShowAccents(settings);
	const stickingEnabled = shouldShowSticking(settings);

	return (
		<div
			className={clsx(
				'MeasureNotation relative w-full border-2 border-primary/30 rounded-lg px-3 py-4 bg-primary/5 shadow-soft',
				stickingEnabled && 'pb-4',
				accentsEnabled && 'pt-6',
				hidden && 'opacity-0',
			)}
		>
			<RhythmAccentOverlay
				steps={steps}
				stepCount={stepCount}
				show={accentsEnabled && fontReady}
			/>
			<div className='relative w-full'>
				<NotationPlaybackCursor
					playback={playback}
					hidden={hidden || !fontReady}
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
			<RhythmStickingOverlay
				steps={steps}
				show={stickingEnabled && fontReady}
			/>
		</div>
	);
}
