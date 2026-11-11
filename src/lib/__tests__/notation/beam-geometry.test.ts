import { describe, expect, test } from 'bun:test';
import {
	beamSegmentsForGroup,
	groupBeamedNotes,
	layoutNotationMeasure,
	measureToNotationSteps,
	NOTATION_SIDE_PAD,
	relativeAdvance,
	stemXForNote,
	stemXsForGroup,
} from '@/lib/notation';
import { MEASURE_LENGTH, REST_MEASURE } from '@/types';

function hits(...cells: number[]): boolean[] {
	const measure = [...REST_MEASURE];
	for (const cell of cells) {
		measure[cell] = true;
	}
	return measure;
}

describe('stemXForNote', () => {
	test('centers the stem in the absolute duration span', () => {
		expect(stemXForNote({ startCell: 0, durationCells: 1 })).toBe(0.5);
		expect(stemXForNote({ startCell: 0, durationCells: 2 })).toBe(1);
		expect(stemXForNote({ startCell: 0, durationCells: 3 })).toBe(1.5);
		expect(stemXForNote({ startCell: 4, durationCells: 4 })).toBe(6);
	});
});

describe('relativeAdvance', () => {
	test('grows with duration but not linearly', () => {
		expect(relativeAdvance(1)).toBe(1);
		expect(relativeAdvance(4)).toBe(2);
		expect(relativeAdvance(16)).toBe(4);
		// Dotted eighth vs sixteenth ≈ 1.73:1, not 3:1.
		expect(relativeAdvance(3) / relativeAdvance(1)).toBeCloseTo(
			Math.sqrt(3),
			5,
		);
	});
});

describe('layoutNotationMeasure', () => {
	test('packs a dotted eighth + sixteenth with a short third for the 16th', () => {
		const steps = measureToNotationSteps(hits(0, 3), undefined, 'sixteenths');
		const notes = steps.filter((s) => s.kind === 'note' && s.startCell < 4);
		expect(notes).toHaveLength(2);
		const [longNote, shortNote] = notes;
		expect(longNote).toBeDefined();
		expect(shortNote).toBeDefined();
		if (!longNote || !shortNote) return;
		const layout = layoutNotationMeasure(steps);
		const long = layout.get(longNote.stepIndex);
		const short = layout.get(shortNote.stepIndex);
		expect(long).toBeDefined();
		expect(short).toBeDefined();
		if (!long || !short) return;
		const pairWidth = long.width + short.width;
		expect(short.width / pairWidth).toBeCloseTo(1 / (1 + Math.sqrt(3)), 5);
		expect(short.stemX).toBeGreaterThan(long.stemX);
	});

	test('packs sixteenth + dotted eighth the same relative way', () => {
		const steps = measureToNotationSteps(
			hits(0, 1, 4),
			undefined,
			'sixteenths',
		);
		const notes = steps.filter((s) => s.kind === 'note' && s.startCell < 4);
		const [shortNote, longNote] = notes;
		expect(shortNote).toBeDefined();
		expect(longNote).toBeDefined();
		if (!shortNote || !longNote) return;
		const layout = layoutNotationMeasure(steps);
		const short = layout.get(shortNote.stepIndex);
		const long = layout.get(longNote.stepIndex);
		expect(short).toBeDefined();
		expect(long).toBeDefined();
		if (!short || !long) return;
		const pairWidth = long.width + short.width;
		expect(short.width / pairWidth).toBeCloseTo(1 / (1 + Math.sqrt(3)), 5);
		expect(long.stemX).toBeGreaterThan(short.stemX);
	});

	test('equal durations share space evenly and stems sit in slot centers', () => {
		const steps = measureToNotationSteps(
			hits(0, 4, 8, 12),
			undefined,
			'quarters',
		);
		const notes = steps.filter((s) => s.kind === 'note');
		const layout = layoutNotationMeasure(steps);
		const slots = notes.map((n) => layout.get(n.stepIndex));
		expect(slots.every((slot) => slot !== undefined)).toBe(true);
		const first = slots[0];
		const last = slots[slots.length - 1];
		expect(first).toBeDefined();
		expect(last).toBeDefined();
		if (!first || !last) return;
		expect(
			slots.every(
				(slot) =>
					slot !== undefined && Math.abs(slot.width - first.width) < 1e-9,
			),
		).toBe(true);
		expect(first.x).toBeCloseTo(NOTATION_SIDE_PAD, 5);
		expect(last.x + last.width).toBeCloseTo(
			MEASURE_LENGTH - NOTATION_SIDE_PAD,
			5,
		);
		expect(first.stemX).toBeCloseTo(first.x + first.width / 2, 5);
		expect(last.stemX).toBeCloseTo(last.x + last.width / 2, 5);
		// First and last stems are symmetric about the measure center.
		expect(first.stemX + last.stemX).toBeCloseTo(MEASURE_LENGTH, 5);
	});

	test('centers a lone whole-measure event', () => {
		const steps = measureToNotationSteps(hits(), undefined, 'quarters');
		const layout = layoutNotationMeasure(steps);
		expect(steps).toHaveLength(1);
		const [step] = steps;
		expect(step).toBeDefined();
		if (!step) return;
		const slot = layout.get(step.stepIndex);
		expect(slot).toBeDefined();
		if (!slot) return;
		expect(slot.stemX).toBeCloseTo(MEASURE_LENGTH / 2, 5);
		expect(slot.x).toBeGreaterThan(NOTATION_SIDE_PAD);
		expect(slot.x + slot.width).toBeLessThan(
			MEASURE_LENGTH - NOTATION_SIDE_PAD,
		);
	});
});

describe('beamSegmentsForGroup', () => {
	test('two eighths get a primary beam only', () => {
		const segments = beamSegmentsForGroup([
			{ startCell: 0, durationCells: 2 },
			{ startCell: 2, durationCells: 2 },
		]);
		expect(segments).toEqual([{ level: 1, x1: 1, x2: 3 }]);
	});

	test('four sixteenths get primary and secondary beams', () => {
		const segments = beamSegmentsForGroup([
			{ startCell: 0, durationCells: 1 },
			{ startCell: 1, durationCells: 1 },
			{ startCell: 2, durationCells: 1 },
			{ startCell: 3, durationCells: 1 },
		]);
		expect(segments).toContainEqual({ level: 1, x1: 0.5, x2: 3.5 });
		expect(segments).toContainEqual({ level: 2, x1: 0.5, x2: 3.5 });
	});

	test('eighth + sixteenth gets a partial secondary beam', () => {
		const segments = beamSegmentsForGroup([
			{ startCell: 0, durationCells: 2 },
			{ startCell: 2, durationCells: 1 },
		]);
		expect(segments).toContainEqual({ level: 1, x1: 1, x2: 2.5 });
		expect(segments).toContainEqual({ level: 2, x1: 2.5 - 1.5 / 3, x2: 2.5 });
	});

	test('sixteenth + eighth gets a partial secondary toward the eighth', () => {
		const segments = beamSegmentsForGroup([
			{ startCell: 0, durationCells: 1 },
			{ startCell: 1, durationCells: 2 },
		]);
		expect(segments).toContainEqual({ level: 1, x1: 0.5, x2: 2 });
		expect(segments).toContainEqual({ level: 2, x1: 0.5, x2: 0.5 + 1.5 / 3 });
	});

	test('accepts relative layout stem xs', () => {
		const notes = [
			{ startCell: 0, durationCells: 3 },
			{ startCell: 3, durationCells: 1 },
		];
		const xs = [1, 4];
		const segments = beamSegmentsForGroup(notes, xs);
		expect(segments).toContainEqual({ level: 1, x1: 1, x2: 4 });
		expect(segments).toContainEqual({ level: 2, x1: 4 - 1, x2: 4 });
	});

	test('single note produces no beams', () => {
		expect(beamSegmentsForGroup([{ startCell: 0, durationCells: 1 }])).toEqual(
			[],
		);
	});
});

describe('groupBeamedNotes', () => {
	test('groups four sixteenths from a spelled measure', () => {
		const steps = measureToNotationSteps(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		const groups = groupBeamedNotes(steps);
		expect(groups.size).toBe(1);
		const notes = [...groups.values()][0];
		expect(notes).toHaveLength(4);
	});
});

describe('stemXsForGroup', () => {
	test('prefers supplied relative stem xs', () => {
		expect(
			stemXsForGroup(
				[
					{ startCell: 0, durationCells: 3 },
					{ startCell: 3, durationCells: 1 },
				],
				[2, 9],
			),
		).toEqual([2, 9]);
	});
});
