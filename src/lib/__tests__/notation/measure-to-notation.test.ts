import { describe, expect, test } from 'bun:test';
import {
	durationInfoForLevel,
	isDottedDuration,
	measureToNotationSteps,
} from '@/lib/notation';
import { REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('durationInfoForLevel', () => {
	test('maps subdivision levels to durations', () => {
		expect(durationInfoForLevel('quarters')).toEqual({
			duration: 'quarter',
			stepCount: 4,
		});
		expect(durationInfoForLevel('eighths')).toEqual({
			duration: 'eighth',
			stepCount: 8,
		});
		expect(durationInfoForLevel('sixteenths')).toEqual({
			duration: 'sixteenth',
			stepCount: 16,
		});
	});
});

describe('isDottedDuration', () => {
	test('detects dotted durations', () => {
		expect(isDottedDuration('dottedEighth')).toBe(true);
		expect(isDottedDuration('dottedQuarter')).toBe(true);
		expect(isDottedDuration('dottedHalf')).toBe(true);
		expect(isDottedDuration('eighth')).toBe(false);
	});
});

describe('measureToNotationSteps', () => {
	test('emits one step per spelled event with duration fill', () => {
		const steps = measureToNotationSteps(hits(0, 4), undefined, 'sixteenths');
		expect(steps).toHaveLength(2);
		expect(steps[0]).toMatchObject({
			hit: true,
			kind: 'note',
			duration: 'quarter',
			startCell: 0,
			durationCells: 4,
		});
		expect(steps[1]).toMatchObject({
			hit: true,
			kind: 'note',
			duration: 'dottedHalf',
			startCell: 4,
			durationCells: 12,
		});
	});

	test('spells eighth-level hits as half notes', () => {
		const steps = measureToNotationSteps(hits(0, 8), undefined, 'eighths');
		expect(steps).toHaveLength(2);
		expect(steps[0]).toMatchObject({
			duration: 'half',
			startCell: 0,
			durationCells: 8,
		});
		expect(steps[1]).toMatchObject({
			duration: 'half',
			startCell: 8,
			durationCells: 8,
		});
	});

	test('respects accent and sticking on rich measure', () => {
		const measure = hits(0);
		const rich = measure.map((hit, index) => ({
			index,
			hit,
			accent: index === 0,
			sticking: index === 0 ? ('L' as const) : undefined,
		}));
		const steps = measureToNotationSteps(measure, rich, 'sixteenths');
		const onset = steps.find((s) => s.hit);
		expect(onset?.accent).toBe(true);
		expect(onset?.sticking).toBe('L');
	});

	test('empty measure is a whole rest step', () => {
		const steps = measureToNotationSteps(REST_MEASURE, undefined, 'sixteenths');
		expect(steps).toHaveLength(1);
		expect(steps[0]).toMatchObject({
			hit: false,
			kind: 'rest',
			duration: 'whole',
			startCell: 0,
			durationCells: 16,
		});
	});

	test('empty first half is a half rest, not a whole rest', () => {
		const steps = measureToNotationSteps(hits(8), undefined, 'sixteenths');
		expect(steps[0]).toMatchObject({
			hit: false,
			kind: 'rest',
			duration: 'half',
			startCell: 0,
			durationCells: 8,
		});
		expect(steps[1]).toMatchObject({
			hit: true,
			kind: 'note',
			duration: 'half',
			startCell: 8,
			durationCells: 8,
		});
	});

	test('dotted quarter carries 6 cells (1.50 beats)', () => {
		const steps = measureToNotationSteps(hits(0, 6), undefined, 'sixteenths');
		expect(steps[0]).toMatchObject({
			hit: true,
			duration: 'dottedQuarter',
			startCell: 0,
			durationCells: 6,
		});
	});

	test('beamed eighth pair emits two separately highlightable steps', () => {
		const steps = measureToNotationSteps(
			hits(0, 2, 4),
			undefined,
			'sixteenths',
		);
		const beamed = steps.filter((step) => step.beamGroupId !== undefined);
		expect(beamed).toHaveLength(2);
		expect(beamed[0]?.beamGroupId).toBe(beamed[1]?.beamGroupId);
		expect(beamed[0]).toMatchObject({
			hit: true,
			duration: 'eighth',
			startCell: 0,
			durationCells: 2,
		});
		expect(beamed[1]).toMatchObject({
			hit: true,
			duration: 'eighth',
			startCell: 2,
			durationCells: 2,
		});
	});

	test('four sixteenths share a beamGroupId as four steps', () => {
		const steps = measureToNotationSteps(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		const notes = steps.filter((step) => step.kind === 'note');
		expect(notes).toHaveLength(4);
		expect(notes.every((n) => n.beamGroupId === notes[0]?.beamGroupId)).toBe(
			true,
		);
		expect(notes.every((n) => n.durationCells === 1)).toBe(true);
	});
});
