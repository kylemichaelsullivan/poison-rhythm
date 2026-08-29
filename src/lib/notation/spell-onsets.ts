import type { SubdivisionLevel } from '@/lib/preference-schemas';
import { MEASURE_LENGTH, type RhythmMeasure } from '@/types';
import {
	CELLS_PER_BEAT,
	durationForCells,
	HALF_BAR_CELL,
	minCellUnitForLevel,
	SPELLING_CELL_LENGTHS,
} from './duration-units';
import type { NotationDuration } from './musisync-glyphs';

export type OnsetSpan = {
	startCell: number;
	durationCells: number;
};

export type NoteSegment = {
	startCell: number;
	durationCells: number;
	duration: NotationDuration;
	tieContinuation: boolean;
	/** Cell of the original onset (for accent/sticking). */
	onsetCell: number;
};

/**
 * Collect onset cells from a measure at the given subdivision resolution.
 * Hits are read on the 16-grid; consecutive cells within one subdivision
 * step count as a single onset at the step start.
 */
export function collectOnsetCells(
	measure: RhythmMeasure,
	level: SubdivisionLevel,
): number[] {
	const unit = minCellUnitForLevel(level);
	const onsets: number[] = [];

	for (let cell = 0; cell < MEASURE_LENGTH; cell += unit) {
		let hit = false;
		for (let offset = 0; offset < unit; offset += 1) {
			if (measure[cell + offset]) {
				hit = true;
				break;
			}
		}
		if (hit) {
			onsets.push(cell);
		}
	}

	return onsets;
}

/** Duration from each onset until the next onset (or end of bar). */
export function onsetSpans(onsets: number[]): OnsetSpan[] {
	const spans: OnsetSpan[] = [];
	for (let i = 0; i < onsets.length; i += 1) {
		const startCell = onsets[i]!;
		const endCell = onsets[i + 1] ?? MEASURE_LENGTH;
		spans.push({
			startCell,
			durationCells: endCell - startCell,
		});
	}
	return spans;
}

/**
 * Spell a sustained span as metrically legal note values.
 * Prefers longest aligned powers of two; splits with ties when syncopated
 * or when a single value would be illegal (Gould-style).
 */
export function splitSpanAtBeats(
	startCell: number,
	durationCells: number,
	onsetCell: number,
): NoteSegment[] {
	const segments: NoteSegment[] = [];
	let remaining = durationCells;
	let cell = startCell;
	let tieContinuation = false;

	while (remaining > 0) {
		const take = chooseNoteLength(cell, remaining);
		const duration = durationForCells(take);
		if (!duration) {
			break;
		}
		segments.push({
			startCell: cell,
			durationCells: take,
			duration,
			tieContinuation,
			onsetCell,
		});
		cell += take;
		remaining -= take;
		tieContinuation = true;
	}

	return segments;
}

/**
 * Longest legal note (including dotted values) that fits at `cell`.
 * Syncopated / short values must stay within the current beat when required.
 */
function chooseNoteLength(cell: number, remaining: number): number {
	for (const candidate of SPELLING_CELL_LENGTHS) {
		if (candidate > remaining) {
			continue;
		}
		if (isLegalNote(cell, candidate)) {
			return candidate;
		}
	}
	return 1;
}

function isLegalNote(cell: number, length: number): boolean {
	const end = cell + length;

	if (length === 16) {
		return cell === 0;
	}

	if (length === 12) {
		// Dotted half: three beats, starting on beat 1 or 2
		return cell === 0 || cell === CELLS_PER_BEAT;
	}

	if (length === 8) {
		return cell === 0 || cell === HALF_BAR_CELL;
	}

	if (length === 6) {
		// Dotted quarter: start on a beat; may cross into the next beat
		return cell % CELLS_PER_BEAT === 0;
	}

	if (length === 4) {
		return cell % CELLS_PER_BEAT === 0;
	}

	// Dotted eighth / eighth / sixteenth: stay within the current beat
	const beatEnd = (Math.floor(cell / CELLS_PER_BEAT) + 1) * CELLS_PER_BEAT;
	if (end > beatEnd) {
		return false;
	}

	return true;
}

export function spellOnsetSegments(
	measure: RhythmMeasure,
	level: SubdivisionLevel,
): NoteSegment[] {
	const onsets = collectOnsetCells(measure, level);
	const spans = onsetSpans(onsets);
	/**
	 * Attack notation for rhythm display: one notehead per onset.
	 * Take only the first metrically legal segment; leftover span becomes rests
	 * (avoids tie continuations rendering as extra flagged noteheads).
	 */
	return spans.flatMap((span) => {
		const segments = splitSpanAtBeats(
			span.startCell,
			span.durationCells,
			span.startCell,
		);
		const onset = segments[0];
		return onset ? [{ ...onset, tieContinuation: false }] : [];
	});
}
