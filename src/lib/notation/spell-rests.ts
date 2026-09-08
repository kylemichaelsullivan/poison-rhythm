import { MEASURE_LENGTH } from '@/types';
import {
	CELLS_PER_BEAT,
	durationForCells,
	HALF_BAR_CELL,
	SPELLING_CELL_LENGTHS,
} from './duration-units';
import type { NotationDuration } from './musisync-glyphs';
import type { NoteSegment } from './spell-onsets';

export type RestSegment = {
	startCell: number;
	durationCells: number;
	duration: NotationDuration;
};

type OccupiedSpan = {
	startCell: number;
	durationCells: number;
};

/**
 * Spell rests into gaps not covered by note segments, using contemporary
 * 4/4 rest consolidation (whole / half-bar / beat-bounded greedy).
 */
export function spellRests(noteSegments: NoteSegment[]): RestSegment[] {
	const occupied = mergeOccupied(
		noteSegments.map((segment) => ({
			startCell: segment.startCell,
			durationCells: segment.durationCells,
		})),
	);
	const gaps = complementaryGaps(occupied);
	return gaps.flatMap((gap) => spellGap(gap.startCell, gap.durationCells));
}

function mergeOccupied(spans: OccupiedSpan[]): OccupiedSpan[] {
	if (spans.length === 0) {
		return [];
	}
	const sorted = [...spans].sort((a, b) => a.startCell - b.startCell);
	const first = sorted[0];
	if (!first) {
		return [];
	}
	const merged: OccupiedSpan[] = [];
	let current = { ...first };

	for (let i = 1; i < sorted.length; i += 1) {
		const next = sorted[i];
		if (!next) {
			continue;
		}
		const currentEnd = current.startCell + current.durationCells;
		if (next.startCell <= currentEnd) {
			const nextEnd = next.startCell + next.durationCells;
			current.durationCells = Math.max(currentEnd, nextEnd) - current.startCell;
		} else {
			merged.push(current);
			current = { ...next };
		}
	}
	merged.push(current);
	return merged;
}

function complementaryGaps(occupied: OccupiedSpan[]): OccupiedSpan[] {
	const gaps: OccupiedSpan[] = [];
	let cursor = 0;

	for (const span of occupied) {
		if (span.startCell > cursor) {
			gaps.push({
				startCell: cursor,
				durationCells: span.startCell - cursor,
			});
		}
		cursor = Math.max(cursor, span.startCell + span.durationCells);
	}

	if (cursor < MEASURE_LENGTH) {
		gaps.push({
			startCell: cursor,
			durationCells: MEASURE_LENGTH - cursor,
		});
	}

	return gaps;
}

export function spellGap(
	startCell: number,
	durationCells: number,
): RestSegment[] {
	if (durationCells <= 0) {
		return [];
	}

	if (startCell === 0 && durationCells === MEASURE_LENGTH) {
		return [rest(0, 16, 'whole')];
	}

	if (durationCells === 8 && (startCell === 0 || startCell === HALF_BAR_CELL)) {
		return [rest(startCell, 8, 'half')];
	}

	const segments: RestSegment[] = [];
	let remaining = durationCells;
	let cell = startCell;

	while (remaining > 0) {
		const take = chooseRestLength(cell, remaining);
		const duration = durationForCells(take);
		if (!duration) {
			break;
		}
		segments.push(rest(cell, take, duration));
		cell += take;
		remaining -= take;
	}

	return segments;
}

/**
 * Longest legal rest (including dotted eighth within a beat).
 * Does not cross mid-bar except for half/whole rests; does not use dotted
 * quarters/halves for rests (prefer plain beat-bounded rests).
 */
function chooseRestLength(cell: number, remaining: number): number {
	for (const candidate of SPELLING_CELL_LENGTHS) {
		if (candidate > remaining) {
			continue;
		}
		// Prefer not to use dotted quarter/half rests in 4/4
		if (candidate === 6 || candidate === 12) {
			continue;
		}
		if (isLegalRest(cell, candidate)) {
			return candidate;
		}
	}
	return 1;
}

function isLegalRest(cell: number, length: number): boolean {
	const end = cell + length;

	if (length === 16) {
		return cell === 0;
	}

	if (length === 8) {
		return cell === 0 || cell === HALF_BAR_CELL;
	}

	if (length === 4) {
		return cell % CELLS_PER_BEAT === 0;
	}

	// Dotted eighth / eighth / sixteenth: must stay within the current beat
	const beatEnd = (Math.floor(cell / CELLS_PER_BEAT) + 1) * CELLS_PER_BEAT;
	if (end > beatEnd) {
		return false;
	}

	if (cell < HALF_BAR_CELL && end > HALF_BAR_CELL) {
		return false;
	}

	return true;
}

function rest(
	startCell: number,
	durationCells: number,
	duration: NotationDuration,
): RestSegment {
	return { startCell, durationCells, duration };
}
