import { describe, expect, test } from 'bun:test';
import {
	collectHighwayNotes,
	countInHighwayProgress,
	HIGHWAY_LOOKAHEAD_MEASURES,
	highwayNoteTrackInset,
	highwayProgress,
	highwayTrackTransform,
	measureProgressFraction,
	padMeasuresForHighwayLookahead,
} from '@/lib/scroll-animation';
import type { RhythmMeasure } from '@/types';
import { MEASURE_LENGTH, REST_MEASURE } from '@/types';

describe('HIGHWAY_LOOKAHEAD_MEASURES', () => {
	test('is a fixed window (tempo drives scroll rate)', () => {
		expect(HIGHWAY_LOOKAHEAD_MEASURES).toBe(3);
	});
});

describe('collectHighwayNotes', () => {
	test('emits one gem per hit, not per measure', () => {
		const measure: RhythmMeasure = Array.from(
			{ length: MEASURE_LENGTH },
			(_, i) => i === 0 || i === 4 || i === 8,
		);
		const notes = collectHighwayNotes([measure, REST_MEASURE]);
		expect(notes).toEqual([
			{ id: '0-0', measureIndex: 0, cellIndex: 0, at: 0 },
			{ id: '0-4', measureIndex: 0, cellIndex: 4, at: 0.25 },
			{ id: '0-8', measureIndex: 0, cellIndex: 8, at: 0.5 },
		]);
	});

	test('places later-measure hits after earlier ones', () => {
		const hitOnOne: RhythmMeasure = Array.from(
			{ length: MEASURE_LENGTH },
			(_, i) => i === 0,
		);
		const notes = collectHighwayNotes([REST_MEASURE, hitOnOne]);
		expect(notes).toEqual([
			{ id: '1-0', measureIndex: 1, cellIndex: 0, at: 1 },
		]);
	});
});

describe('countInHighwayProgress', () => {
	test('starts one measure before the first attack', () => {
		expect(countInHighwayProgress(null, 0)).toBe(-1);
		expect(countInHighwayProgress(1, 0)).toBe(-1);
	});

	test('reaches 0 at the end of the last count-in beat', () => {
		expect(countInHighwayProgress(4, 1)).toBe(0);
	});

	test('glides through the four count-in quarters', () => {
		expect(countInHighwayProgress(2, 0)).toBe(-0.75);
		expect(countInHighwayProgress(3, 0.5)).toBe(-0.375);
	});
});

describe('measureProgressFraction', () => {
	test('returns 0 at the first sixteenth', () => {
		expect(measureProgressFraction(0, 'sixteenths', 0)).toBe(0);
	});

	test('returns mid-bar and end-bar fractions', () => {
		expect(measureProgressFraction(8, 'sixteenths', 0)).toBe(0.5);
		expect(measureProgressFraction(15, 'sixteenths', 1)).toBe(1);
	});
});

describe('highwayProgress', () => {
	test('adds measure index to in-bar fraction', () => {
		expect(highwayProgress(2, 8, 'sixteenths', 0)).toBe(2.5);
	});
});

describe('highwayTrackTransform', () => {
	test('slides the track so progress stays on the judgment line', () => {
		expect(highwayTrackTransform('down', 1.5, 100)).toBe(
			'translate3d(0, 150px, 0)',
		);
		expect(highwayTrackTransform('up', 1.5, 100)).toBe(
			'translate3d(0, -150px, 0)',
		);
	});
});

describe('highwayNoteTrackInset', () => {
	test('pins gems in track space for down scroll', () => {
		expect(highwayNoteTrackInset('down', 1, 160, 16)).toEqual({
			bottom: `${160 - 8}px`,
		});
	});
});

describe('padMeasuresForHighwayLookahead', () => {
	const hit: RhythmMeasure = Array.from(
		{ length: MEASURE_LENGTH },
		(_, i) => i === 0,
	);
	const other: RhythmMeasure = Array.from(
		{ length: MEASURE_LENGTH },
		(_, i) => i === 4,
	);

	test('pads after poison until a full lookahead window', () => {
		const measures = [hit, other, hit];
		const padded = padMeasuresForHighwayLookahead(measures, 1, 3);
		expect(padded.length).toBe(1 + 1 + 3);
		expect(padded.slice(0, 3)).toEqual(measures);
	});

	test('is a no-op when enough measures already follow poison', () => {
		const measures = [hit, other, hit, other, hit];
		expect(padMeasuresForHighwayLookahead(measures, 1, 3)).toBe(measures);
	});

	test('pads past the last measure when poison is off', () => {
		const measures = [hit, other];
		const padded = padMeasuresForHighwayLookahead(measures, -1, 3);
		expect(padded.length).toBe(2 + 3);
	});
});
