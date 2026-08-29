import { beamedGlyphForDurations } from './beam-glyphs';
import { beatIndex, CELLS_PER_BEAT } from './duration-units';
import { musisyncGlyphFor } from './musisync-glyphs';
import type { NotationEvent } from './notation-events';

const QUARTER_CELLS = CELLS_PER_BEAT;

export type BeamableNote = Pick<
	NotationEvent,
	| 'startCell'
	| 'durationCells'
	| 'kind'
	| 'duration'
	| 'tieContinuation'
	| 'beamGroupId'
>;

export type BeamAttempt =
	| { ok: true; glyph: string; notes: NotationEvent[] }
	| { ok: false; notes: NotationEvent[] };

export type NotationGlyphToken = {
	glyph: string;
	/** Events collapsed into this visual glyph (1+ when beamed). */
	events: NotationEvent[];
};

/** True when a note may join a conventional beam (shorter than a quarter, not a tie). */
export function isBeamableNote(event: BeamableNote): boolean {
	return (
		event.kind === 'note' &&
		!event.tieContinuation &&
		event.durationCells > 0 &&
		event.durationCells < QUARTER_CELLS
	);
}

/**
 * Try to replace a run of notes with one MusiSync beamed glyph using
 * contemporary beat-group patterns (e.g. two eighths → `n`).
 */
export function tryBeamNotes(notes: NotationEvent[]): BeamAttempt {
	if (notes.length < 2 || !notes.every(isBeamableNote)) {
		return { ok: false, notes };
	}

	if (!notesShareBeat(notes) || !notesAreContiguous(notes)) {
		return { ok: false, notes };
	}

	const glyph = beamedGlyphForDurations(
		notes.map((note) => note.durationCells),
	);
	if (!glyph) {
		return { ok: false, notes };
	}

	return { ok: true, glyph, notes };
}

/**
 * Partition events into conventional beam runs: contiguous beamable notes in
 * the same beat.
 */
export function collectBeamRuns(events: NotationEvent[]): NotationEvent[][] {
	const runs: NotationEvent[][] = [];
	let i = 0;

	while (i < events.length) {
		const event = events[i]!;
		if (!isBeamableNote(event)) {
			runs.push([event]);
			i += 1;
			continue;
		}

		const run: NotationEvent[] = [event];
		let j = i + 1;
		while (j < events.length) {
			const next = events[j]!;
			const prev = run[run.length - 1]!;
			if (
				!isBeamableNote(next) ||
				!notesShareBeat([run[0]!, next]) ||
				!notesAreContiguous([prev, next])
			) {
				break;
			}
			run.push(next);
			j += 1;
		}

		runs.push(run);
		i = j;
	}

	return runs;
}

/**
 * Apply conventional beaming for display: collapse each successful beam run
 * into a MusiSync beamed glyph; otherwise emit one glyph per event.
 */
export function beamNotesForDisplay(
	events: NotationEvent[],
): NotationGlyphToken[] {
	const tokens: NotationGlyphToken[] = [];

	for (const run of collectBeamRuns(events)) {
		const attempt = tryBeamNotes(run);
		if (attempt.ok) {
			tokens.push({ glyph: attempt.glyph, events: attempt.notes });
			continue;
		}

		// Partial conventional beaming: greedy pair/group chunks inside the run
		let offset = 0;
		while (offset < run.length) {
			const remaining = run.slice(offset);
			const chunked = tryBeamLongestPrefix(remaining);
			if (chunked.ok) {
				tokens.push({ glyph: chunked.glyph, events: chunked.notes });
				offset += chunked.notes.length;
				continue;
			}
			const single = remaining[0]!;
			tokens.push({
				glyph: musisyncGlyphFor(single.kind, single.duration),
				events: [single],
			});
			offset += 1;
		}
	}

	return tokens;
}

/** Prefer the longest conventional beamed prefix (4, then 3, then 2 notes). */
function tryBeamLongestPrefix(notes: NotationEvent[]): BeamAttempt {
	for (let length = Math.min(notes.length, 4); length >= 2; length -= 1) {
		const attempt = tryBeamNotes(notes.slice(0, length));
		if (attempt.ok) {
			return attempt;
		}
	}
	return { ok: false, notes };
}

function notesShareBeat(notes: BeamableNote[]): boolean {
	if (notes.length === 0) {
		return true;
	}
	const beat = beatIndex(notes[0]!.startCell);
	return notes.every((note) => beatIndex(note.startCell) === beat);
}

function notesAreContiguous(notes: BeamableNote[]): boolean {
	for (let i = 1; i < notes.length; i += 1) {
		const prev = notes[i - 1]!;
		const next = notes[i]!;
		if (next.startCell !== prev.startCell + prev.durationCells) {
			return false;
		}
	}
	return true;
}
