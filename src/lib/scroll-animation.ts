import { subdivisionStepCount } from '@/lib/subdivision-playback';
import { MEASURE_LENGTH } from '@/types';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { ScrollDirection } from '@/lib/settings-schema';
import type { RhythmMeasure } from '@/types';

/** How far ahead (in measures) notes remain visible on the highway. */
export const HIGHWAY_LOOKAHEAD_MEASURES = 3;

/**
 * Decoys past poison (generation + display pad). Exceeds the visible highway
 * so the stream does not end at the viewport edge and tip off the poison.
 */
export const TRAILING_DECOYS_AFTER_POISON = HIGHWAY_LOOKAHEAD_MEASURES + 2;

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

/**
 * Ensures the highway always shows more than a viewport of patterns past the
 * poison (or past the last measure), so emptiness cannot tip off the poison.
 * Pads by cycling non-poison measures; playback still uses the unpadded round.
 */
export function padMeasuresForHighwayLookahead(
	measures: RhythmMeasure[],
	poisonIndex: number,
	lookaheadMeasures = TRAILING_DECOYS_AFTER_POISON,
): RhythmMeasure[] {
	if (measures.length === 0 || lookaheadMeasures <= 0) return measures;

	const anchorIndex =
		poisonIndex >= 0 && poisonIndex < measures.length
			? poisonIndex
			: measures.length - 1;
	const existingAfter = measures.length - anchorIndex - 1;
	const needed = Math.max(0, lookaheadMeasures - existingAfter);
	if (needed === 0) return measures;

	const sources = measures.filter((_, index) => index !== poisonIndex);
	if (sources.length === 0) return measures;

	const pad: RhythmMeasure[] = [];
	for (let i = 0; i < needed; i += 1) {
		const source = sources[(anchorIndex + i) % sources.length];
		if (!source) continue;
		pad.push(source);
	}
	return pad.length === 0 ? measures : [...measures, ...pad];
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
 * One measure of highway approach before the first playback attack (count-in).
 * Progress runs ≈ −1 → 0 over the count-in bar, then continues through the round.
 */
export const HIGHWAY_COUNT_IN_LEAD_MEASURES = 1;

/** Resting playhead before a session so the lead-in measure is already on screen. */
export const HIGHWAY_IDLE_PROGRESS = -HIGHWAY_COUNT_IN_LEAD_MEASURES;

/**
 * Highway progress from the AudioContext timeline used by `scheduleHit`.
 * `heldSec` is audio time spent paused between bars (lookahead hold).
 * Before `originAt` (count-in) progress is negative — one measure of approach space.
 */
export function highwayAudioProgress(
	audioNow: number,
	originAt: number,
	measureSec: number,
	heldSec = 0,
): number {
	if (measureSec <= 0) return HIGHWAY_IDLE_PROGRESS;
	return (audioNow - originAt - heldSec) / measureSec;
}

/** Seconds of musical time for one 4/4 measure at the given tempo. */
export function highwayMeasureSec(tempo: number): number {
	return (60 / Math.max(tempo, 1)) * 4;
}

/**
 * Effective “now” while the lookahead scheduler is held after a bar.
 * `holdFreezeAt` is the last-step audio time: keep advancing until then,
 * then freeze so a look-ahead pause cannot jump the highway past the hit.
 */
export function highwayAudioNowWhileHeld(
	audioNow: number,
	holdFreezeAt: number | null,
): number {
	if (holdFreezeAt === null) return audioNow;
	return Math.min(audioNow, holdFreezeAt);
}

/** Audio time of the next bar’s first step after a completed last step. */
export function nextHighwayOriginAfterPassRestart(
	lastStepAudioTime: number,
	stepSec: number,
): number {
	return lastStepAudioTime + Math.max(stepSec, 0);
}

/** Fold a completed lookahead hold into the accumulated held duration. */
export function accumulateHighwayHold(
	heldSec: number,
	holdStartedAt: number,
	resumeAudioTime: number,
): number {
	return heldSec + Math.max(0, resumeAudioTime - holdStartedAt);
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
