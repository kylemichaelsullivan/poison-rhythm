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

	test('eighth rest within a beat', () => {
		expect(spellGap(0, 2)).toEqual([
			{ startCell: 0, durationCells: 2, duration: 'eighth' },
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
});
