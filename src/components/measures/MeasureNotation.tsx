import clsx from 'clsx';
import { useMemo } from 'react';
import { useActiveNotationStepIndex } from '@/hooks/useActiveNotationStepIndex';
import { useSubdivisionProgress } from '@/hooks/useSubdivisionProgress';
import { layoutNotationMeasure, measureToNotationSteps } from '@/lib/notation';
import { shouldHighlightNotationPlayback } from '@/lib/playback-state';
import { MeasureNotationGlyph } from './MeasureNotationGlyph';
import { measureShellClass } from './measure-phase-chrome';
import { NotationBeamLayer } from './notation/NotationBeamLayer';
import { RhythmAccentOverlay } from './RhythmAccentOverlay';
import { RhythmStickingOverlay } from './RhythmStickingOverlay';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';
import type { MeasureDisplayOptions } from './measure-display-options';
import type { MeasurePlaybackPhase } from './measure-phase-chrome';

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
	const steps = useMemo(
		() =>
			measureToNotationSteps(measure, richMeasure, display.subdivisionLevel),
		[measure, richMeasure, display.subdivisionLevel],
	);
	const layout = useMemo(() => layoutNotationMeasure(steps), [steps]);
	const { showAccents, showSticking } = display;

	const highlighting = shouldHighlightNotationPlayback({
		playbackEnabled: playback,
		isMeasuresPlaying: display.isMeasuresPlaying,
		showVisual: display.showVisualFeedback,
	});
	const progress = useSubdivisionProgress(highlighting);
	const activeStepIndex = useActiveNotationStepIndex(
		steps,
		highlighting,
		progress,
	);

	return (
		<div
			className={clsx(
				'MeasureNotation relative w-full px-2 py-2 sm:px-3 sm:py-4',
				measureShellClass(phase),
				showSticking && 'pb-4',
				showAccents && 'pt-6',
				hidden && 'opacity-0',
			)}
		>
			<RhythmAccentOverlay steps={steps} layout={layout} show={showAccents} />
			<section
				className='MeasureNotationLine relative text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface'
				aria-label='Rhythm Notation'
				data-step-count={steps.length}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard users must focus horizontal overflow
				tabIndex={0}
			>
				<NotationBeamLayer steps={steps} layout={layout} />
				{steps.map((step) => {
					const slot = layout.get(step.stepIndex);
					if (!slot) return null;
					return (
						<MeasureNotationGlyph
							key={step.stepIndex}
							step={step}
							slot={slot}
							active={step.stepIndex === activeStepIndex}
							highlighting={highlighting}
							phase={phase}
						/>
					);
				})}
			</section>
			<RhythmStickingOverlay
				steps={steps}
				layout={layout}
				show={showSticking}
			/>
		</div>
	);
}
