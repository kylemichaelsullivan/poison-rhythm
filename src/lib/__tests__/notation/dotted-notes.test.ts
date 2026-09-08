import { describe, expect, test } from 'bun:test';
import {
	beamedGlyphForDurations,
	durationForCells,
	eventsToAbcBody,
	eventsToMusiSyncString,
	MUSISYNC_BEAMED,
	MUSISYNC_GLYPH,
	measureToNotationEvents,
	musisyncGlyphFor,
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
	});

	test('MusiSync glyphs for dotted values', () => {
		expect(musisyncGlyphFor('note', 'dottedEighth')).toBe(
			MUSISYNC_GLYPH.dottedEighthNote,
		);
		expect(musisyncGlyphFor('note', 'dottedQuarter')).toBe(
			MUSISYNC_GLYPH.dottedQuarterNote,
		);
		expect(musisyncGlyphFor('note', 'dottedHalf')).toBe(
			MUSISYNC_GLYPH.dottedHalfNote,
		);
		expect(musisyncGlyphFor('rest', 'dottedEighth')).toBe('E.');
	});

	test('dotted eighth + sixteenth beams to MusiSync o', () => {
		expect(beamedGlyphForDurations([3, 1])).toBe(
			MUSISYNC_BEAMED.dottedEighthSixteenth,
		);
		// Hits on beat and on “a”
		const events = measureToNotationEvents(hits(0, 3), undefined, 'sixteenths');
		expect(eventsToMusiSyncString(events).startsWith('o')).toBe(true);
		expect(eventsToAbcBody(events).startsWith('c3 c')).toBe(true);
	});

	test('sixteenth + dotted eighth beams to MusiSync O', () => {
		expect(beamedGlyphForDurations([1, 3])).toBe(
			MUSISYNC_BEAMED.sixteenthDottedEighth,
		);
		// Hits on beat and on “e”; next attack on beat 2
		const events = measureToNotationEvents(
			hits(0, 1, 4),
			undefined,
			'sixteenths',
		);
		expect(eventsToMusiSyncString(events).startsWith('O')).toBe(true);
		expect(eventsToAbcBody(events).startsWith('c c3')).toBe(true);
	});

	test('sixteenth on “e” + eighth on “&” stays flagged (no O alias)', () => {
		const events = measureToNotationEvents(
			hits(0, 5, 6, 8, 12, 14),
			undefined,
			'sixteenths',
		);
		// [1,2] has no MusiSync beamed glyph; do not fake dotted O
		expect(eventsToMusiSyncString(events)).toBe('qSseqn');
	});

	test('repeated e+& syncopation stays flagged until a full-beat pattern', () => {
		const events = measureToNotationEvents(
			hits(1, 2, 5, 6, 9, 10, 12, 13, 14, 15),
			undefined,
			'sixteenths',
		);
		expect(eventsToMusiSyncString(events)).toBe('SseSseSsey');
	});

	test('isolated dotted eighth then rest within a beat', () => {
		// Hit only on beat 1; next hit on beat 2 → attack spelling prefers
		// quarter when span is 4, not dotted eighth
		const quarterSpan = measureToNotationEvents(
			hits(0, 4),
			undefined,
			'sixteenths',
		);
		expect(quarterSpan[0]).toMatchObject({
			kind: 'note',
			duration: 'quarter',
		});

		// Span of 3 sixteenths to next attack → dotted eighth
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
		expect(eventsToMusiSyncString(events).startsWith('d')).toBe(true);
	});
});
