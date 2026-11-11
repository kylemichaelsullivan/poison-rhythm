import { describe, expect, test } from 'bun:test';
import { measureToNotationEvents } from '@/lib/notation';
import { assignBeamGroups } from '@/lib/notation/beam-groups';
import { REST_MEASURE } from '@/types';
import type { NoteSegment } from '@/lib/notation/spell-onsets';

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
		];
		const beams = assignBeamGroups(segments);
		expect(beams.get(0)).toBe(0);
		expect(beams.get(1)).toBe(0);
		expect(beams.get(2)).toBe(0);
		expect(beams.get(3)).toBe(0);
		expect(beams.has(4)).toBe(false);
	});

	test('does not beam quarters', () => {
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
	});

	test('empty first half is a half rest, not a whole rest', () => {
		const events = measureToNotationEvents(hits(8), undefined, 'sixteenths');
		expect(events[0]).toMatchObject({
			kind: 'rest',
			duration: 'half',
			startCell: 0,
			durationCells: 8,
		});
		expect(events[1]).toMatchObject({
			kind: 'note',
			duration: 'half',
			startCell: 8,
			durationCells: 8,
		});
	});

	test('quarters on 1 and 3 → two half notes', () => {
		const events = measureToNotationEvents(hits(0, 8), undefined, 'quarters');
		expect(events.map((e) => e.duration)).toEqual(['half', 'half']);
	});

	test('quarters on each beat → four quarters', () => {
		const events = measureToNotationEvents(
			hits(0, 4, 8, 12),
			undefined,
			'quarters',
		);
		expect(events.map((e) => e.duration)).toEqual([
			'quarter',
			'quarter',
			'quarter',
			'quarter',
		]);
	});

	test('quarters on beats 1 and 2 → quarter then dotted half', () => {
		const events = measureToNotationEvents(hits(0, 4), undefined, 'quarters');
		expect(events.map((e) => e.duration)).toEqual(['quarter', 'dottedHalf']);
		expect(events.every((e) => !e.tieContinuation)).toBe(true);
	});

	test('rest on 1, hit on 2 then two eighths on 4', () => {
		const events = measureToNotationEvents(
			hits(4, 12, 14),
			undefined,
			'eighths',
		);
		expect(events[0]).toMatchObject({
			kind: 'rest',
			duration: 'quarter',
			startCell: 0,
		});
		expect(events[1]).toMatchObject({
			kind: 'note',
			duration: 'half',
			startCell: 4,
			durationCells: 8,
		});
		const beamed = events.filter((e) => e.beamGroupId !== undefined);
		expect(beamed).toHaveLength(2);
		expect(beamed.every((e) => e.duration === 'eighth')).toBe(true);
	});

	test('isolated hit on the & of 1 is a dotted quarter', () => {
		const events = measureToNotationEvents(hits(2), undefined, 'eighths');
		expect(events[0]).toMatchObject({
			kind: 'rest',
			duration: 'eighth',
			startCell: 0,
		});
		expect(events[1]).toMatchObject({
			kind: 'note',
			duration: 'dottedQuarter',
			startCell: 2,
			tieContinuation: undefined,
		});
	});

	test('hit on the & of 2 starts with a dotted quarter rest', () => {
		const events = measureToNotationEvents(hits(6, 12), undefined, 'eighths');
		expect(events[0]).toMatchObject({
			kind: 'rest',
			duration: 'dottedQuarter',
			startCell: 0,
			durationCells: 6,
		});
	});

	test('eighth–quarter–eighth syncopation in each half-bar', () => {
		const first = measureToNotationEvents(hits(0, 2, 6), undefined, 'eighths');
		expect(first.map((e) => `${e.kind}:${e.duration}`)).toEqual([
			'note:eighth',
			'note:quarter',
			'note:eighth',
			'rest:half',
		]);
		const second = measureToNotationEvents(
			hits(8, 10, 14),
			undefined,
			'eighths',
		);
		expect(second.map((e) => `${e.kind}:${e.duration}`)).toEqual([
			'rest:half',
			'note:eighth',
			'note:quarter',
			'note:eighth',
		]);
	});

	test('eighth rest then dotted quarter completes the first half-bar', () => {
		const events = measureToNotationEvents(hits(2, 8), undefined, 'eighths');
		expect(events[1]).toMatchObject({
			kind: 'note',
			duration: 'dottedQuarter',
			startCell: 2,
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

	test('consecutive eighths in a beat share a beamGroupId', () => {
		const events = measureToNotationEvents(
			hits(0, 2, 4, 6, 8, 10, 12, 14),
			undefined,
			'eighths',
		);
		const notes = events.filter((e) => e.kind === 'note');
		expect(notes).toHaveLength(8);
		expect(notes.every((n) => n.beamGroupId !== undefined)).toBe(true);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(4);
	});

	test('four sixteenths in a beat share one beamGroupId as four events', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		const notes = events.filter((e) => e.kind === 'note');
		expect(notes).toHaveLength(4);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('eighth + two sixteenths share a beamGroupId', () => {
		const events = measureToNotationEvents(
			hits(0, 2, 3),
			undefined,
			'sixteenths',
		);
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes.map((n) => n.durationCells)).toEqual([2, 1, 1]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('sixteenth rest + three sixteenths beams the three notes', () => {
		const events = measureToNotationEvents(
			hits(1, 2, 3),
			undefined,
			'sixteenths',
		);
		expect(events[0]).toMatchObject({ kind: 'rest', duration: 'sixteenth' });
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes).toHaveLength(3);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
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
