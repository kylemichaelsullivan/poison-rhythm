import { COUNT_IN_BEATS } from '@/lib/metronome-defaults';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { ScrollDirection } from '@/lib/settings-schema';
import { subdivisionStepCount } from '@/lib/subdivision-playback';
import type { RhythmMeasure } from '@/types';
import { MEASURE_LENGTH } from '@/types';

/** How far ahead (in measures) notes remain visible on the highway. */
export const HIGHWAY_LOOKAHEAD_MEASURES = 3;

/** Pixels of travel per measure; tempo maps this distance to wall-clock time. */
export const HIGHWAY_PX_PER_MEASURE = 160;

export type HighwayNote = {
	id: string;
	measureIndex: number;
	cellIndex: number;
	/** Absolute attack time in measure units (0 = start of round). */
	at: number;
};

/** Hit gems for the highway: one note per true cell, timed on the 16th grid. */
export function collectHighwayNotes(measures: RhythmMeasure[]): HighwayNote[] {
	const notes: HighwayNote[] = [];
	for (
		let measureIndex = 0;
		measureIndex < measures.length;
		measureIndex += 1
	) {
		const measure = measures[measureIndex];
		if (!measure) continue;
		for (let cellIndex = 0; cellIndex < MEASURE_LENGTH; cellIndex += 1) {
			if (!measure[cellIndex]) continue;
			notes.push({
				id: `${measureIndex}-${cellIndex}`,
				measureIndex,
				cellIndex,
				at: measureIndex + cellIndex / MEASURE_LENGTH,
			});
		}
	}
	return notes;
}

/** Fraction of the current measure completed (0–1). */
export function measureProgressFraction(
	subdivisionIndex: number,
	level: SubdivisionLevel,
	beatFraction = 0,
): number {
	const stepCount = subdivisionStepCount(level);
	if (stepCount <= 0) return 0;
	const clampedFraction = Math.min(Math.max(beatFraction, 0), 1);
	return Math.min(
		Math.max((subdivisionIndex + clampedFraction) / stepCount, 0),
		1,
	);
}

/**
 * Count-in maps one full measure of approach onto the highway:
 * beat 1 @ fraction 0 → −1; end of last beat → 0 (first playback attack).
 */
export function countInHighwayProgress(
	countInBeat: number | null,
	beatFraction = 0,
	beatCount = COUNT_IN_BEATS,
): number {
	if (beatCount <= 0) return 0;
	const beatIndex = countInBeat === null ? 0 : Math.max(countInBeat - 1, 0);
	const clampedFraction =
		countInBeat === null ? 0 : Math.min(Math.max(beatFraction, 0), 1);
	return -1 + (beatIndex + clampedFraction) / beatCount;
}

/** Global highway progress in measure units from the start of the round. */
export function highwayProgress(
	measureIndex: number,
	subdivisionIndex: number,
	level: SubdivisionLevel,
	beatFraction = 0,
): number {
	return (
		Math.max(measureIndex, 0) +
		measureProgressFraction(subdivisionIndex, level, beatFraction)
	);
}

/**
 * Distance from the judgment line along the approach axis.
 * Positive = still approaching; 0 = at the line; negative = past.
 */
export function highwayNoteOffsetPx(
	noteAt: number,
	progress: number,
	pxPerMeasure: number,
): number {
	return (noteAt - progress) * pxPerMeasure;
}

/** CSS transform that slides the note track so `progress` sits on the judgment line. */
export function highwayTrackTransform(
	direction: Exclude<ScrollDirection, 'none'>,
	progress: number,
	pxPerMeasure: number,
): string {
	const px = progress * pxPerMeasure;
	switch (direction) {
		case 'down':
			return `translate3d(0, ${px}px, 0)`;
		case 'up':
			return `translate3d(0, ${-px}px, 0)`;
		case 'right':
			return `translate3d(${px}px, 0, 0)`;
		case 'left':
			return `translate3d(${-px}px, 0, 0)`;
	}
}

/** Fixed position of a note within the scrolling track (judgment-aligned at progress 0). */
export function highwayNoteTrackInset(
	direction: Exclude<ScrollDirection, 'none'>,
	noteAt: number,
	pxPerMeasure: number,
	gemSizePx: number,
): { top?: string; right?: string; bottom?: string; left?: string } {
	const along = noteAt * pxPerMeasure - gemSizePx / 2;
	const px = `${along}px`;
	switch (direction) {
		case 'down':
			return { bottom: px };
		case 'up':
			return { top: px };
		case 'right':
			return { right: px };
		case 'left':
			return { left: px };
	}
}

export function scrollAnimationClass(direction: ScrollDirection): string {
	if (direction === 'none') return '';
	return `scroll-highway scroll-${direction}`;
}
