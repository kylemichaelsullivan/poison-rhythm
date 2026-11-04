import { describe, expect, test } from 'bun:test';
import {
	durationGlyphsForLevel,
	measureToNotationSteps,
	musisyncGlyphFor,
	notationStepsToGlyphString,
} from '@/lib/notation';
import { REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('musisyncGlyphFor', () => {
	test('uses conventional MusiSync duration keys', () => {
		expect(musisyncGlyphFor('note', 'whole')).toBe('w');
		expect(musisyncGlyphFor('rest', 'whole')).toBe('W');
		expect(musisyncGlyphFor('note', 'half')).toBe('h');
		expect(musisyncGlyphFor('rest', 'half')).toBe('H');
		expect(musisyncGlyphFor('note', 'quarter')).toBe('q');
		expect(musisyncGlyphFor('rest', 'quarter')).toBe('Q');
		expect(musisyncGlyphFor('note', 'eighth')).toBe('e');
		expect(musisyncGlyphFor('rest', 'eighth')).toBe('E');
		expect(musisyncGlyphFor('note', 'sixteenth')).toBe('s');
		expect(musisyncGlyphFor('rest', 'sixteenth')).toBe('S');
	});
});

describe('durationGlyphsForLevel', () => {
	test('maps subdivision levels to note/rest pairs', () => {
		expect(durationGlyphsForLevel('quarters')).toMatchObject({
			note: 'q',
			rest: 'Q',
			stepCount: 4,
		});
		expect(durationGlyphsForLevel('eighths')).toMatchObject({
			note: 'e',
			rest: 'E',
			stepCount: 8,
		});
		expect(durationGlyphsForLevel('sixteenths')).toMatchObject({
			note: 's',
			rest: 'S',
			stepCount: 16,
		});
	});
});

describe('measureToNotationSteps', () => {
	test('spells sixteenth hits with duration fill and rests', () => {
		const steps = measureToNotationSteps(hits(0, 4), undefined, 'sixteenths');
		expect(steps.length).toBeGreaterThan(0);
		expect(steps[0]?.hit).toBe(true);
		expect(steps[0]?.glyph).toBe('q');
		expect(steps[0]).toMatchObject({ startCell: 0, durationCells: 4 });
		// Second attack spans three beats → dotted half
		expect(notationStepsToGlyphString(steps)).toBe('qd');
		expect(steps[1]).toMatchObject({
			glyph: 'd',
			startCell: 4,
			durationCells: 12,
		});
	});

	test('spells eighth-level hits with conventional glyphs', () => {
		const steps = measureToNotationSteps(hits(0, 8), undefined, 'eighths');
		expect(steps[0]?.glyph).toBe('h');
		expect(notationStepsToGlyphString(steps)).toBe('hh');
		expect(steps[0]).toMatchObject({ startCell: 0, durationCells: 8 });
		expect(steps[1]).toMatchObject({ startCell: 8, durationCells: 8 });
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
		expect(steps[0]?.hit).toBe(false);
		expect(steps[0]?.glyph).toBe('W');
		expect(steps[0]).toMatchObject({ startCell: 0, durationCells: 16 });
	});

	test('empty first half is a half rest, not a whole rest', () => {
		const steps = measureToNotationSteps(hits(8), undefined, 'sixteenths');
		expect(notationStepsToGlyphString(steps)).toBe('Hh');
		expect(steps[0]).toMatchObject({
			hit: false,
			glyph: 'H',
			startCell: 0,
			durationCells: 8,
		});
	});

	test('dotted quarter carries 6 cells (1.50 beats)', () => {
		const steps = measureToNotationSteps(hits(0, 6), undefined, 'sixteenths');
		expect(steps[0]).toMatchObject({
			hit: true,
			startCell: 0,
			durationCells: 6,
		});
	});

	test('beamed eighth pair spans a full beat', () => {
		const steps = measureToNotationSteps(
			hits(0, 2, 4),
			undefined,
			'sixteenths',
		);
		const beamed = steps.find((step) => step.glyph === 'n');
		expect(beamed).toMatchObject({
			hit: true,
			startCell: 0,
			durationCells: 4,
		});
	});
});
