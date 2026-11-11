import { describe, expect, test } from 'bun:test';
import {
	activeNotationStepIndex,
	buildNotationCellStepMap,
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

describe('notation-playback', () => {
	test('maps each cell in a quarter note to its glyph step', () => {
		const steps = measureToNotationSteps(hits(0, 4), undefined, 'sixteenths');
		const map = buildNotationCellStepMap(steps);

		expect(map[0]).toBe(0);
		expect(map[3]).toBe(0);
		expect(map[4]).toBe(1);
		expect(map[15]).toBe(1);
		expect(activeNotationStepIndex(map, 2)).toBe(0);
		expect(activeNotationStepIndex(map, 10)).toBe(1);
	});

	test('dotted quarter stays active for 6 cells', () => {
		const steps = measureToNotationSteps(hits(0, 6), undefined, 'sixteenths');
		const map = buildNotationCellStepMap(steps);

		expect(map.slice(0, 6).every((index) => index === 0)).toBe(true);
		expect(map[6]).not.toBe(0);
	});

	test('beamed eighths highlight independently per duration', () => {
		const steps = measureToNotationSteps(
			hits(0, 2, 4),
			undefined,
			'sixteenths',
		);
		const first = steps.find(
			(step) => step.beamGroupId !== undefined && step.startCell === 0,
		);
		const second = steps.find(
			(step) => step.beamGroupId !== undefined && step.startCell === 2,
		);
		expect(first).toBeDefined();
		expect(second).toBeDefined();
		if (!first || !second) return;

		const map = buildNotationCellStepMap(steps);
		expect(map[0]).toBe(first.stepIndex);
		expect(map[1]).toBe(first.stepIndex);
		expect(map[2]).toBe(second.stepIndex);
		expect(map[3]).toBe(second.stepIndex);
	});

	test('four beamed sixteenths advance the playhead per cell', () => {
		const steps = measureToNotationSteps(
			hits(0, 1, 2, 3),
			undefined,
			'sixteenths',
		);
		const notes = steps.filter((step) => step.kind === 'note');
		expect(notes).toHaveLength(4);
		const map = buildNotationCellStepMap(steps);
		expect(map[0]).toBe(notes[0]?.stepIndex);
		expect(map[1]).toBe(notes[1]?.stepIndex);
		expect(map[2]).toBe(notes[2]?.stepIndex);
		expect(map[3]).toBe(notes[3]?.stepIndex);
	});

	test('whole rest fills the entire measure map', () => {
		const steps = measureToNotationSteps(REST_MEASURE, undefined, 'sixteenths');
		const map = buildNotationCellStepMap(steps);
		expect(map.every((index) => index === 0)).toBe(true);
	});

	test('activeNotationStepIndex returns null out of range', () => {
		const map = buildNotationCellStepMap([]);
		expect(activeNotationStepIndex(map, -1)).toBeNull();
		expect(activeNotationStepIndex(map, 16)).toBeNull();
		expect(activeNotationStepIndex(map, 0)).toBeNull();
	});
});
