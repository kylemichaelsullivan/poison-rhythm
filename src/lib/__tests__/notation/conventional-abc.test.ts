import { describe, expect, test } from 'bun:test';
import {
	eventsToAbcBody,
	measureToAbc,
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

describe('conventional ABC / beaming figures', () => {
	test('sixteenth–eighth–sixteenth beams as one group', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 3),
			undefined,
			'sixteenths',
		);
		const notes = events.filter((e) => e.kind === 'note');
		expect(notes.map((n) => n.durationCells)).toEqual([1, 2, 1]);
		expect(new Set(notes.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('Poison Rhythm ABC body matches conventional beat grouping', () => {
		const measure = hits(0, 1, 3, 4, 5, 7, 8, 10, 12, 14);
		const events = measureToNotationEvents(measure, undefined, 'sixteenths');
		expect(eventsToAbcBody(events)).toBe('c c2 c c c2 c c2 c2 c2 c2 |]');
	});

	test('Current Measure ABC body matches conventional beat grouping', () => {
		const measure = hits(0, 1, 3, 4, 5, 6, 8, 10, 12, 13, 14, 15);
		const events = measureToNotationEvents(measure, undefined, 'sixteenths');
		expect(eventsToAbcBody(events)).toBe('c c2 c c c c2 c2 c2 c c c c |]');
	});

	test('rest-led [2,1] and [1,1] beam instead of flagged pairs', () => {
		const measure = hits(1, 3, 6, 7, 8, 9, 10, 11, 12, 14, 15);
		const events = measureToNotationEvents(measure, undefined, 'sixteenths');
		const beat1 = events.filter(
			(e) => e.kind === 'note' && e.startCell >= 0 && e.startCell < 4,
		);
		expect(beat1.map((n) => n.durationCells)).toEqual([2, 1]);
		expect(new Set(beat1.map((n) => n.beamGroupId)).size).toBe(1);

		const beat2 = events.filter(
			(e) => e.kind === 'note' && e.startCell >= 4 && e.startCell < 8,
		);
		expect(beat2.map((n) => n.durationCells)).toEqual([1, 1]);
		expect(new Set(beat2.map((n) => n.beamGroupId)).size).toBe(1);
	});

	test('measureToAbc emits perc clef header', () => {
		const abc = measureToAbc(hits(0, 2), undefined, 'eighths', {
			title: 'Poison Rhythm',
			index: 1,
		});
		expect(abc).toContain('T:Poison Rhythm');
		expect(abc).toContain('M:4/4');
		expect(abc).toContain('L:1/16');
		expect(abc).toContain('clef=perc');
		expect(abc).toContain('%%beambrack 4');
	});
});
