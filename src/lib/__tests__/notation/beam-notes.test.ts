import { describe, expect, test } from 'bun:test';
import { MUSISYNC_BEAMED } from '@/lib/notation/beam-glyphs';
import {
	beamNotesForDisplay,
	collectBeamRuns,
	isBeamableNote,
	tryBeamNotes,
} from '@/lib/notation/beam-notes';
import type { NotationEvent } from '@/lib/notation/notation-events';

function note(
	startCell: number,
	durationCells: number,
	beamGroupId?: number,
): NotationEvent {
	const duration =
		durationCells === 1
			? 'sixteenth'
			: durationCells === 2
				? 'eighth'
				: durationCells === 4
					? 'quarter'
					: 'half';
	return {
		startCell,
		durationCells,
		kind: 'note',
		duration,
		beamGroupId,
	};
}

function rest(startCell: number, durationCells: number): NotationEvent {
	const duration =
		durationCells === 1
			? 'sixteenth'
			: durationCells === 2
				? 'eighth'
				: 'quarter';
	return {
		startCell,
		durationCells,
		kind: 'rest',
		duration,
	};
}

describe('isBeamableNote', () => {
	test('allows short onsets only', () => {
		expect(isBeamableNote(note(0, 2))).toBe(true);
		expect(isBeamableNote(note(0, 1))).toBe(true);
		expect(isBeamableNote(note(0, 4))).toBe(false);
		expect(isBeamableNote({ ...note(0, 2), tieContinuation: true })).toBe(
			false,
		);
		expect(isBeamableNote(rest(0, 2))).toBe(false);
	});
});

describe('tryBeamNotes', () => {
	test('beams two eighths in one beat', () => {
		const attempt = tryBeamNotes([note(0, 2), note(2, 2)]);
		expect(attempt.ok).toBe(true);
		if (attempt.ok) {
			expect(attempt.glyph).toBe(MUSISYNC_BEAMED.twoEighths);
		}
	});

	test('rejects notes that cross a beat boundary', () => {
		const attempt = tryBeamNotes([note(2, 2), note(4, 2)]);
		expect(attempt.ok).toBe(false);
	});

	test('rejects unmatched patterns', () => {
		expect(tryBeamNotes([note(0, 1), note(1, 1)]).ok).toBe(false);
	});

	test('beams three sixteenths in one beat', () => {
		const attempt = tryBeamNotes([note(1, 1), note(2, 1), note(3, 1)]);
		expect(attempt.ok).toBe(true);
		if (attempt.ok) {
			expect(attempt.glyph).toBe(MUSISYNC_BEAMED.threeSixteenths);
		}
	});

	test('beams sixteenth + eighth [1,2] without aliasing to dotted O', () => {
		const attempt = tryBeamNotes([note(5, 1), note(6, 2)]);
		expect(attempt.ok).toBe(true);
		if (attempt.ok) {
			expect(attempt.glyph).toBe(MUSISYNC_BEAMED.sixteenthEighth);
			expect(attempt.glyph).not.toBe(MUSISYNC_BEAMED.sixteenthDottedEighth);
		}
	});
});

describe('collectBeamRuns', () => {
	test('groups contiguous same-beam notes and leaves rests alone', () => {
		const events = [
			note(0, 2, 0),
			note(2, 2, 0),
			rest(4, 4),
			note(8, 2, 1),
			note(10, 2, 1),
		];
		const runs = collectBeamRuns(events);
		expect(runs).toHaveLength(3);
		expect(runs[0]).toHaveLength(2);
		expect(runs[1]).toHaveLength(1);
		expect(runs[2]).toHaveLength(2);
	});
});

describe('beamNotesForDisplay', () => {
	test('collapses conventional eighth pairs for display', () => {
		const tokens = beamNotesForDisplay([
			note(0, 2, 0),
			note(2, 2, 0),
			note(4, 2, 1),
			note(6, 2, 1),
		]);
		expect(tokens.map((t) => t.glyph).join('')).toBe('nn');
		expect(tokens[0]?.events).toHaveLength(2);
	});

	test('falls back to flagged glyphs when beaming is not conventional', () => {
		const tokens = beamNotesForDisplay([note(0, 2), rest(2, 2)]);
		expect(tokens.map((t) => t.glyph).join('')).toBe('eE');
	});

	test('beams three sixteenths after a sixteenth rest in the beat', () => {
		const tokens = beamNotesForDisplay([
			rest(0, 1),
			note(1, 1),
			note(2, 1),
			note(3, 1),
		]);
		expect(tokens.map((t) => t.glyph).join('')).toBe(
			`S${MUSISYNC_BEAMED.threeSixteenths}`,
		);
		expect(tokens[1]?.events).toHaveLength(3);
	});

	test('beams sixteenth + eighth after a sixteenth rest in the beat', () => {
		const tokens = beamNotesForDisplay([rest(0, 1), note(1, 1), note(2, 2)]);
		expect(tokens.map((t) => t.glyph).join('')).toBe(
			`S${MUSISYNC_BEAMED.sixteenthEighth}`,
		);
		expect(tokens[1]?.events).toHaveLength(2);
	});
});
