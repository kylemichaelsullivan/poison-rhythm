import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { RhythmRenderMode } from '@/lib/settings-schema';

/** Settings + metronome flags for prop-driven measure / notation leaves. */
export type MeasureDisplayOptions = {
	renderMode: RhythmRenderMode;
	subdivisionLevel: SubdivisionLevel;
	showVisualFeedback: boolean;
	showAccents: boolean;
	showSticking: boolean;
	isMeasuresPlaying: boolean;
	subdivisionIndex: number;
};
