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
		// Second attack spans three beats → dotted half
		expect(notationStepsToGlyphString(steps)).toBe('qd');
	});

	test('spells eighth-level hits with conventional glyphs', () => {
		const steps = measureToNotationSteps(hits(0, 8), undefined, 'eighths');
		expect(steps[0]?.glyph).toBe('h');
		expect(notationStepsToGlyphString(steps)).toBe('hh');
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
		expect(steps[0]?.glyph).toBe('H');
	});
});
