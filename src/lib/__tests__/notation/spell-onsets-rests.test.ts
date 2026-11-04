import { describe, expect, test } from 'bun:test';
import {
	collectOnsetCells,
	onsetSpans,
	spellOnsetSegments,
	splitSpanAtBeats,
} from '@/lib/notation/spell-onsets';
import { spellGap, spellRests } from '@/lib/notation/spell-rests';
import { REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('spell-onsets', () => {
	test('collects onsets at subdivision resolution', () => {
		expect(collectOnsetCells(hits(0, 2, 4), 'sixteenths')).toEqual([0, 2, 4]);
		expect(collectOnsetCells(hits(0, 2, 4), 'eighths')).toEqual([0, 2, 4]);
		expect(collectOnsetCells(hits(0, 4, 8), 'quarters')).toEqual([0, 4, 8]);
		// Sixteenth-only hit collapses into eighth onset at cell 0 when level is eighths
		expect(collectOnsetCells(hits(1), 'eighths')).toEqual([0]);
	});

	test('onset spans fill until next attack', () => {
		expect(onsetSpans([0, 4, 8])).toEqual([
			{ startCell: 0, durationCells: 4 },
			{ startCell: 4, durationCells: 4 },
			{ startCell: 8, durationCells: 8 },
		]);
	});

	test('splitSpanAtBeats marks tie continuations for syncopation', () => {
		const segments = splitSpanAtBeats(3, 5, 3);
		expect(
			segments.map((s) => ({
				start: s.startCell,
				cells: s.durationCells,
				tie: s.tieContinuation,
			})),
		).toEqual([
			{ start: 3, cells: 1, tie: false },
			{ start: 4, cells: 4, tie: true },
		]);
	});

	test('aligned half-span spells as a half note', () => {
		const segments = splitSpanAtBeats(0, 8, 0);
		expect(segments).toEqual([
			{
				startCell: 0,
				durationCells: 8,
				duration: 'half',
				tieContinuation: false,
				onsetCell: 0,
			},
		]);
	});

	test('half note on beat 2 covers beats 2–3', () => {
		const segments = splitSpanAtBeats(4, 8, 4);
		expect(segments).toEqual([
			{
				startCell: 4,
				durationCells: 8,
				duration: 'half',
				tieContinuation: false,
				onsetCell: 4,
			},
		]);
	});

	test('adjacent sixteenth hits stay separate onsets without ties', () => {
		const segments = spellOnsetSegments(hits(0, 1), 'sixteenths');
		expect(segments).toHaveLength(2);
		expect(segments.every((s) => !s.tieContinuation)).toBe(true);
		expect(segments[0]).toMatchObject({
			startCell: 0,
			durationCells: 1,
			tieContinuation: false,
		});
		expect(segments[1]).toMatchObject({
			startCell: 1,
			tieContinuation: false,
		});
	});

	test('eighth–quarter–eighth syncopation uses a quarter on the &', () => {
		const segments = spellOnsetSegments(hits(0, 2, 6), 'eighths');
		expect(segments.map((s) => s.duration)).toEqual([
			'eighth',
			'quarter',
			'eighth',
		]);
		expect(segments[1]).toMatchObject({
			startCell: 2,
			durationCells: 4,
			duration: 'quarter',
		});
	});

	test('eighth + dotted quarter fills a half-bar from the &', () => {
		const segments = spellOnsetSegments(hits(0, 2, 8), 'eighths');
		expect(segments.map((s) => s.duration)).toEqual([
			'eighth',
			'dottedQuarter',
			'half',
		]);
		expect(segments[1]).toMatchObject({
			startCell: 2,
			durationCells: 6,
			duration: 'dottedQuarter',
		});
	});

	test('does not write a quarter across the mid-bar from the & of 2', () => {
		const segments = spellOnsetSegments(hits(6, 10), 'eighths');
		expect(segments[0]).toMatchObject({
			startCell: 6,
			durationCells: 2,
			duration: 'eighth',
		});
	});
});

describe('spell-rests', () => {
	test('empty measure is a whole rest', () => {
		expect(spellGap(0, 16)).toEqual([
			{ startCell: 0, durationCells: 16, duration: 'whole' },
		]);
	});

	test('half-bar rests at 0 and 8', () => {
		expect(spellGap(0, 8)).toEqual([
			{ startCell: 0, durationCells: 8, duration: 'half' },
		]);
		expect(spellGap(8, 8)).toEqual([
			{ startCell: 8, durationCells: 8, duration: 'half' },
		]);
	});

	test('does not merge rests across mid-bar', () => {
		const rests = spellGap(4, 8);
		expect(
			rests.every(
				(r) => r.duration !== 'half' || r.startCell === 0 || r.startCell === 8,
			),
		).toBe(true);
		expect(
			rests.some((r) => r.startCell < 8 && r.startCell + r.durationCells > 8),
		).toBe(false);
	});

	test('dotted quarter rest at the start of a half-bar', () => {
		expect(spellGap(0, 6)).toEqual([
			{ startCell: 0, durationCells: 6, duration: 'dottedQuarter' },
		]);
		expect(spellGap(8, 6)).toEqual([
			{ startCell: 8, durationCells: 6, duration: 'dottedQuarter' },
		]);
	});

	test('does not use a dotted quarter rest across the mid-bar', () => {
		expect(spellGap(4, 6)).toEqual([
			{ startCell: 4, durationCells: 4, duration: 'quarter' },
			{ startCell: 8, durationCells: 2, duration: 'eighth' },
		]);
	});

	test('does not use a dotted half rest in 4/4', () => {
		expect(spellGap(0, 12)).toEqual([
			{ startCell: 0, durationCells: 8, duration: 'half' },
			{ startCell: 8, durationCells: 4, duration: 'quarter' },
		]);
	});

	test('fills gaps around quarter notes on each beat', () => {
		const notes = spellOnsetSegments(hits(0, 4, 8, 12), 'quarters');
		expect(spellRests(notes)).toEqual([]);
	});

	test('fills gap between beat-1 hit and later material', () => {
		const notes = spellOnsetSegments(hits(0), 'quarters');
		// Whole note covers the bar — no rests
		expect(spellRests(notes)).toEqual([]);
	});

	test('rest after short note in first half', () => {
		const notes = spellOnsetSegments(hits(0, 4), 'sixteenths');
		// q at 0; dotted half at 4 covers the rest of the bar — no rests
		expect(spellRests(notes)).toEqual([]);
	});

	test('rest before syncopated eighth', () => {
		const notes = spellOnsetSegments(hits(2), 'eighths');
		const rests = spellRests(notes);
		expect(rests[0]).toEqual({
			startCell: 0,
			durationCells: 2,
			duration: 'eighth',
		});
	});

	test('rest before the & of 2 is a dotted quarter', () => {
		const notes = spellOnsetSegments(hits(6, 12), 'eighths');
		const rests = spellRests(notes);
		expect(rests[0]).toEqual({
			startCell: 0,
			durationCells: 6,
			duration: 'dottedQuarter',
		});
	});

	test('dotted eighth rest on a beat, not on e', () => {
		expect(spellGap(0, 3)).toEqual([
			{ startCell: 0, durationCells: 3, duration: 'dottedEighth' },
		]);
		expect(spellGap(1, 3)).toEqual([
			{ startCell: 1, durationCells: 1, duration: 'sixteenth' },
			{ startCell: 2, durationCells: 2, duration: 'eighth' },
		]);
	});

	test('eighth rest on a beat or &, not on e', () => {
		expect(spellGap(0, 2)).toEqual([
			{ startCell: 0, durationCells: 2, duration: 'eighth' },
		]);
		expect(spellGap(2, 2)).toEqual([
			{ startCell: 2, durationCells: 2, duration: 'eighth' },
		]);
		expect(spellGap(1, 2)).toEqual([
			{ startCell: 1, durationCells: 1, duration: 'sixteenth' },
			{ startCell: 2, durationCells: 1, duration: 'sixteenth' },
		]);
	});
});
