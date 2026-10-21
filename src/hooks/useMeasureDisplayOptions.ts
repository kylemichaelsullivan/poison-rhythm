import type { MeasureDisplayOptions } from '@/components/measures/measure-display-options';
import { useMetronome, useSettings, useSubdivision } from '@/contexts';
import { shouldShowVisualFeedback } from '@/lib/audio';
import { shouldShowAccents, shouldShowSticking } from '@/lib/settings-schema';

/** Derive measure chrome flags once in a section composer. */
export function useMeasureDisplayOptions(): MeasureDisplayOptions {
	const { settings } = useSettings();
	const { subdivisionLevel } = useSubdivision();
	const { isMeasuresPlaying, subdivisionIndex } = useMetronome();

	return {
		renderMode: settings.rhythmRenderMode,
		subdivisionLevel,
		showVisualFeedback: shouldShowVisualFeedback(settings.feedbackMode),
		showAccents: shouldShowAccents(settings),
		showSticking: shouldShowSticking(settings),
		isMeasuresPlaying,
		subdivisionIndex,
	};
}
