import { describe, expect, test } from 'bun:test';
import { MUSISYNC_GLYPH, measureToNotationEvents } from '@/lib/notation';
import { MUSISYNC_BEAMED } from '@/lib/notation/beam-glyphs';
import { assignBeamGroups } from '@/lib/notation/beam-groups';
import { eventsToMusiSyncString } from '@/lib/notation/events-to-musisync';
import type { NoteSegment } from '@/lib/notation/spell-onsets';
import { REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('beam-groups', () => {
	test('beams multiple short notes in the same beat', () => {
		const segments: NoteSegment[] = [
			{
				startCell: 0,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 0,
			},
			{
				startCell: 1,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 1,
			},
			{
				startCell: 2,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 2,
			},
			{
				startCell: 3,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 3,
			},
			{
				startCell: 4,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 4,
			},
			{
				startCell: 5,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 5,
			},
		];
		const beams = assignBeamGroups(segments);
		expect(beams.get(0)).toBe(beams.get(1));
		expect(beams.get(0)).toBe(beams.get(3));
		expect(beams.get(4)).toBe(beams.get(5));
		expect(beams.get(0)).not.toBe(beams.get(4));
	});

	test('does not beam notes separated by a gap in the same beat', () => {
		const segments: NoteSegment[] = [
			{
				startCell: 0,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 0,
			},
			{
				startCell: 2,
				durationCells: 1,
				duration: 'sixteenth',
				tieContinuation: false,
				onsetCell: 2,
			},
		];
		expect(assignBeamGroups(segments).size).toBe(0);
	});

	test('does not beam quarter notes', () => {
		const segments: NoteSegment[] = [
			{
				startCell: 0,
				durationCells: 4,
				duration: 'quarter',
				tieContinuation: false,
				onsetCell: 0,
			},
			{
				startCell: 4,
				durationCells: 4,
				duration: 'quarter',
				tieContinuation: false,
				onsetCell: 4,
			},
		];
		expect(assignBeamGroups(segments).size).toBe(0);
	});
});

describe('measureToNotationEvents', () => {
	test('empty measure is a whole rest', () => {
		const events = measureToNotationEvents(
			REST_MEASURE,
			undefined,
			'sixteenths',
		);
		expect(events).toEqual([
			{
				startCell: 0,
				durationCells: 16,
				kind: 'rest',
				duration: 'whole',
			},
		]);
		expect(eventsToMusiSyncString(events)).toBe(MUSISYNC_GLYPH.wholeRest);
	});

	test('quarters on 1 and 3 → two half notes', () => {
		const events = measureToNotationEvents(hits(0, 8), undefined, 'quarters');
		expect(eventsToMusiSyncString(events)).toBe('hh');
	});

	test('quarters on each beat → qqqq', () => {
		const events = measureToNotationEvents(
			hits(0, 4, 8, 12),
			undefined,
			'quarters',
		);
		expect(eventsToMusiSyncString(events)).toBe('qqqq');
	});

	test('quarters on beats 1 and 2 → quarter then dotted half', () => {
		const events = measureToNotationEvents(hits(0, 4), undefined, 'quarters');
		expect(eventsToMusiSyncString(events)).toBe('qd');
		expect(events.every((e) => !e.tieContinuation)).toBe(true);
	});

	test('eighth rest then eighth on beat 1', () => {
		const events = measureToNotationEvents(hits(2), undefined, 'eighths');
		const glyphs = eventsToMusiSyncString(events);
		expect(glyphs.startsWith('Ee')).toBe(true);
		expect(events[0]).toMatchObject({
			kind: 'rest',
			duration: 'eighth',
			startCell: 0,
		});
		expect(events[1]).toMatchObject({
			kind: 'note',
			duration: 'eighth',
			startCell: 2,
			tieContinuation: undefined,
		});
	});

	test('isolated hit on beat 1 fills the whole bar as a whole note', () => {
		const events = measureToNotationEvents(hits(0), undefined, 'sixteenths');
		expect(events).toEqual([
			{
				startCell: 0,
				durationCells: 16,
				kind: 'note',
				duration: 'whole',
			},
		]);
	});

	test('syncopation uses one attack notehead then rests (no tie noteheads)', () => {
		// Hit on “a” of beat 1 (cell 3); next hit at cell 8
		const events = measureToNotationEvents(hits(3, 8), undefined, 'sixteenths');
		const notes = events.filter((e) => e.kind === 'note');
		expect(notes).toHaveLength(2);
		expect(notes[0]).toMatchObject({
			startCell: 3,
			durationCells: 1,
			tieContinuation: undefined,
		});
		expect(notes[1]).toMatchObject({
			startCell: 8,
			tieContinuation: undefined,
		});
		expect(events.some((e) => e.tieContinuation)).toBe(false);
		expect(events.some((e) => e.kind === 'rest')).toBe(true);
	});

	test('beaming ids shared within a beat', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		const beat1Notes = events.filter(
			(e) => e.kind === 'note' && e.startCell < 4 && !e.tieContinuation,
		);
		const ids = beat1Notes.map((e) => e.beamGroupId);
		expect(ids.every((id) => id !== undefined)).toBe(true);
		expect(new Set(ids).size).toBe(1);
	});

	test('eighths level never emits sixteenth durations', () => {
		const events = measureToNotationEvents(hits(0, 2, 4), undefined, 'eighths');
		expect(events.every((e) => e.duration !== 'sixteenth')).toBe(true);
	});

	test('glyph string uses only known MusiSync keys', () => {
		const events = measureToNotationEvents(
			hits(0, 3, 5, 8, 11),
			undefined,
			'sixteenths',
		);
		const allowed = new Set<string>([
			...Object.values(MUSISYNC_GLYPH),
			...Object.values(MUSISYNC_BEAMED),
		]);
		for (const char of eventsToMusiSyncString(events)) {
			expect(allowed.has(char)).toBe(true);
		}
	});

	test('consecutive eighths in a beat collapse to beamed glyph n', () => {
		const events = measureToNotationEvents(
			hits(0, 2, 4, 6, 8, 10, 12, 14),
			undefined,
			'eighths',
		);
		expect(eventsToMusiSyncString(events)).toBe('nnnn');
	});

	test('four sixteenths in a beat collapse to beamed glyph y', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		expect(eventsToMusiSyncString(events).startsWith('y')).toBe(true);
	});

	test('eighth + two sixteenths uses beamed glyph m', () => {
		const events = measureToNotationEvents(
			hits(0, 2, 3),
			undefined,
			'sixteenths',
		);
		expect(eventsToMusiSyncString(events).startsWith('m')).toBe(true);
	});

	test('sixteenth rest + three sixteenths beams as S³', () => {
		const events = measureToNotationEvents(
			hits(1, 2, 3),
			undefined,
			'sixteenths',
		);
		expect(eventsToMusiSyncString(events).startsWith('S³')).toBe(true);
	});

	test('preserves accent and sticking on onset only', () => {
		const measure = hits(0, 8);
		const rich = measure.map((hit, index) => ({
			index,
			hit,
			accent: index === 0,
			sticking: index === 0 ? ('R' as const) : undefined,
		}));
		const events = measureToNotationEvents(measure, rich, 'quarters');
		const first = events.find((e) => e.kind === 'note' && e.startCell === 0);
		expect(first?.accent).toBe(true);
		expect(first?.sticking).toBe('R');
		const tied = events.filter((e) => e.tieContinuation);
		expect(
			tied.every((e) => e.accent === undefined && e.sticking === undefined),
		).toBe(true);
	});
});
