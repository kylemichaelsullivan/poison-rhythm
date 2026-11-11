import { describe, expect, test } from 'bun:test';
import {
	durationForCells,
	eventsToAbcBody,
	isDottedDuration,
	measureToNotationEvents,
} from '@/lib/notation';
import { REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('dotted notes', () => {
	test('maps dotted cell spans to durations', () => {
		expect(durationForCells(3)).toBe('dottedEighth');
		expect(durationForCells(6)).toBe('dottedQuarter');
		expect(durationForCells(12)).toBe('dottedHalf');
		expect(isDottedDuration('dottedEighth')).toBe(true);
		expect(isDottedDuration('dottedQuarter')).toBe(true);
		expect(isDottedDuration('dottedHalf')).toBe(true);
	});

	test('dotted eighth + sixteenth share a beamGroupId', () => {
		const events = measureToNotationEvents(hits(0, 3), undefined, 'sixteenths');
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes.map((n) => n.durationCells)).toEqual([3, 1]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
		expect(eventsToAbcBody(events).startsWith('c3 c')).toBe(true);
	});

	test('sixteenth + dotted eighth share a beamGroupId', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 4),
			undefined,
			'sixteenths',
		);
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes.map((n) => n.durationCells)).toEqual([1, 3]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
		expect(eventsToAbcBody(events).startsWith('c c3')).toBe(true);
	});

	test('sixteenth on “e” + eighth on “&” beams as undotted [1,2]', () => {
		const events = measureToNotationEvents(
			hits(0, 5, 6, 8, 12, 14),
			undefined,
			'sixteenths',
		);
		const beat2 = events.filter(
			(e) => e.kind === 'note' && e.startCell >= 4 && e.startCell < 8,
		);
		expect(beat2.map((n) => n.durationCells)).toEqual([1, 2]);
		expect(new Set(beat2.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('rest + eighth + sixteenth beams as undotted [2,1]', () => {
		const events = measureToNotationEvents(
			hits(1, 3, 4),
			undefined,
			'sixteenths',
		);
		expect(events[0]).toMatchObject({ kind: 'rest', duration: 'sixteenth' });
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes.map((n) => n.durationCells)).toEqual([2, 1]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('eighth rest + two sixteenths beams as [1,1]', () => {
		const events = measureToNotationEvents(
			hits(2, 3, 4),
			undefined,
			'sixteenths',
		);
		expect(events[0]).toMatchObject({ kind: 'rest', duration: 'eighth' });
		const notes = events.filter((e) => e.kind === 'note' && e.startCell < 4);
		expect(notes.map((n) => n.durationCells)).toEqual([1, 1]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('repeated e+& syncopation beams each [1,2] pair', () => {
		const events = measureToNotationEvents(
			hits(1, 2, 5, 6, 9, 10, 12, 13, 14, 15),
			undefined,
			'sixteenths',
		);
		for (const beat of [0, 1, 2]) {
			const notes = events.filter(
				(e) =>
					e.kind === 'note' &&
					e.startCell >= beat * 4 &&
					e.startCell < beat * 4 + 4,
			);
			expect(notes.map((n) => n.durationCells)).toEqual([1, 2]);
			expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
		}
	});

	test('isolated dotted eighth then rest within a beat', () => {
		const quarterSpan = measureToNotationEvents(
			hits(0, 4),
			undefined,
			'sixteenths',
		);
		expect(quarterSpan[0]).toMatchObject({
			kind: 'note',
			duration: 'quarter',
		});

		const events = measureToNotationEvents(
			hits(0, 3, 4),
			undefined,
			'sixteenths',
		);
		expect(events[0]).toMatchObject({
			kind: 'note',
			duration: 'dottedEighth',
			durationCells: 3,
		});
	});

	test('dotted half note for three-beat span from downbeat', () => {
		const events = measureToNotationEvents(
			hits(0, 12),
			undefined,
			'sixteenths',
		);
		expect(events[0]).toMatchObject({
			kind: 'note',
			duration: 'dottedHalf',
			durationCells: 12,
		});
	});
});
