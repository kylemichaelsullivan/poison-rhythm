import { describe, expect, test } from 'bun:test';
import {
	accumulateHighwayHold,
	collectHighwayNotes,
	HIGHWAY_COUNT_IN_LEAD_MEASURES,
	HIGHWAY_IDLE_PROGRESS,
	HIGHWAY_LOOKAHEAD_MEASURES,
	highwayAudioNowWhileHeld,
	highwayAudioProgress,
	highwayMeasureSec,
	highwayNoteTrackInset,
	highwayProgress,
	highwayTrackTransform,
	measureProgressFraction,
	nextHighwayOriginAfterPassRestart,
	padMeasuresForHighwayLookahead,
} from '@/lib/scroll-animation';
import { MEASURE_LENGTH, REST_MEASURE } from '@/types';
import type { RhythmMeasure } from '@/types';

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

describe('highwayAudioProgress', () => {
	test('is 0 at the playback origin', () => {
		expect(highwayAudioProgress(10, 10, 2, 0)).toBe(0);
	});

	test('advances in measure units from the audio clock', () => {
		expect(highwayAudioProgress(11, 10, 2, 0)).toBe(0.5);
		expect(highwayAudioProgress(12, 10, 2, 0)).toBe(1);
	});

	test('subtracts held audio gaps so bar pauses do not advance the highway', () => {
		expect(highwayAudioProgress(12.5, 10, 2, 0.5)).toBe(1);
	});

	test('maps one lead-in measure of count-in before the origin', () => {
		expect(HIGHWAY_COUNT_IN_LEAD_MEASURES).toBe(1);
		expect(HIGHWAY_IDLE_PROGRESS).toBe(-1);
		expect(highwayAudioProgress(8, 10, 2, 0)).toBe(-1);
		expect(highwayAudioProgress(9, 10, 2, 0)).toBe(-0.5);
	});

	test('returns idle lead-in when measureSec is invalid', () => {
		expect(highwayAudioProgress(12, 10, 0, 0)).toBe(HIGHWAY_IDLE_PROGRESS);
		expect(highwayAudioProgress(12, 10, -1, 0)).toBe(HIGHWAY_IDLE_PROGRESS);
	});
});

describe('highwayMeasureSec', () => {
	test('is four quarter notes at the given tempo', () => {
		expect(highwayMeasureSec(120)).toBe(2);
		expect(highwayMeasureSec(60)).toBe(4);
	});
});

describe('highwayAudioNowWhileHeld', () => {
	test('passes through live audio time when not held', () => {
		expect(highwayAudioNowWhileHeld(5.5, null)).toBe(5.5);
	});

	test('keeps advancing until the freeze point then clamps', () => {
		expect(highwayAudioNowWhileHeld(6.0, 6.25)).toBe(6.0);
		expect(highwayAudioNowWhileHeld(6.25, 6.25)).toBe(6.25);
		expect(highwayAudioNowWhileHeld(8, 6.25)).toBe(6.25);
	});
});

describe('nextHighwayOriginAfterPassRestart', () => {
	test('maps the student-pass downbeat after a demo last step', () => {
		expect(nextHighwayOriginAfterPassRestart(4.0, 0.5)).toBe(4.5);
	});
});

describe('accumulateHighwayHold', () => {
	test('adds the held gap so progress stays continuous across a bar pause', () => {
		expect(accumulateHighwayHold(0.25, 10, 10.4)).toBeCloseTo(0.65);
	});

	test('ignores inverted resume times', () => {
		expect(accumulateHighwayHold(1, 10, 9)).toBe(1);
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
