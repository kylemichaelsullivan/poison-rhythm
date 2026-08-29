import { describe, expect, test } from 'bun:test';
import {
	eventsToAbcBody,
	eventsToMusiSyncString,
	MUSISYNC_BEAMED,
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
	test('sixteenth–eighth–sixteenth beams to MusiSync ¾', () => {
		const events = measureToNotationEvents(
			hits(0, 1, 3),
			undefined,
			'sixteenths',
		);
		const notes = events.filter((e) => e.kind === 'note');
		expect(notes.map((n) => n.durationCells)).toEqual([1, 2, 1]);
		expect(
			eventsToMusiSyncString(events).startsWith(
				MUSISYNC_BEAMED.sixteenthEighthSixteenth,
			),
		).toBe(true);
	});

	test('Poison Rhythm ABC body matches conventional beat grouping', () => {
		// Beats: 16-8-16 | 16-8-16 | 8-8 | 8-8  (ABC: c d2 c …)
		const measure = hits(0, 1, 3, 4, 5, 7, 8, 10, 12, 14);
		const events = measureToNotationEvents(measure, undefined, 'sixteenths');
		expect(eventsToAbcBody(events)).toBe('c c2 c c c2 c c2 c2 c2 c2 |]');
		expect(eventsToMusiSyncString(events)).toBe(
			`${MUSISYNC_BEAMED.sixteenthEighthSixteenth}${MUSISYNC_BEAMED.sixteenthEighthSixteenth}${MUSISYNC_BEAMED.twoEighths}${MUSISYNC_BEAMED.twoEighths}`,
		);
	});

	test('Current Measure ABC body matches conventional beat grouping', () => {
		// Beats: 16-8-16 | 16-16-8 | 8-8 | 16×4
		const measure = hits(0, 1, 3, 4, 5, 6, 8, 10, 12, 13, 14, 15);
		const events = measureToNotationEvents(measure, undefined, 'sixteenths');
		expect(eventsToAbcBody(events)).toBe('c c2 c c c c2 c2 c2 c c c c |]');
		expect(eventsToMusiSyncString(events)).toBe(
			`${MUSISYNC_BEAMED.sixteenthEighthSixteenth}${MUSISYNC_BEAMED.twoSixteenthsEighth}${MUSISYNC_BEAMED.twoEighths}${MUSISYNC_BEAMED.fourSixteenths}`,
		);
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
