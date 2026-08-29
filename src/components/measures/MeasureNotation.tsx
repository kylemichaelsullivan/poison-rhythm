import clsx from 'clsx';
import { useEffect } from 'react';
import { usePreferences, useSettings } from '@/contexts';
import {
	loadMusiSyncFont,
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
	const { subdivisionLevel } = usePreferences();
	const { settings } = useSettings();
	const steps = measureToNotationSteps(measure, richMeasure, subdivisionLevel);
	const glyphString = notationStepsToGlyphString(steps);
	const stepCount = Math.max(steps.length, 1);
	const showAccents = shouldShowAccents(settings);
	const showSticking = shouldShowSticking(settings);

	useEffect(() => {
		void loadMusiSyncFont();
	}, []);

	return (
		<div
			className={clsx(
				'MeasureNotation relative w-full border border-mid rounded-lg px-3 py-4',
				showSticking && 'pb-4',
				showAccents && 'pt-6',
				hidden && 'opacity-0',
			)}
		>
			<RhythmAccentOverlay
				steps={steps}
				stepCount={stepCount}
				show={showAccents}
			/>
			<div className='relative w-full'>
				<NotationPlaybackCursor playback={playback} hidden={hidden} />
				<div
					role='img'
					className='MeasureNotationLine MusiSync text-current'
					aria-label='Rhythm Notation'
					data-glyphs={glyphString}
				>
					{steps.map((step) => (
						<MeasureNotationGlyph key={step.stepIndex} glyph={step.glyph} />
					))}
				</div>
			</div>
			<RhythmStickingOverlay steps={steps} show={showSticking} />
		</div>
	);
}
