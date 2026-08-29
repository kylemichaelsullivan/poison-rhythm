import { describe, expect, test } from 'bun:test';
import {
	beatIndex,
	cellsForDuration,
	cellsUntilBeatEnd,
	durationForCells,
	HALF_BAR_CELL,
	isHalfBarBoundary,
	minCellUnitForLevel,
} from '@/lib/notation/duration-units';

describe('duration-units', () => {
	test('maps power-of-two and dotted cell spans to durations', () => {
		expect(durationForCells(1)).toBe('sixteenth');
		expect(durationForCells(2)).toBe('eighth');
		expect(durationForCells(3)).toBe('dottedEighth');
		expect(durationForCells(4)).toBe('quarter');
		expect(durationForCells(6)).toBe('dottedQuarter');
		expect(durationForCells(8)).toBe('half');
		expect(durationForCells(12)).toBe('dottedHalf');
		expect(durationForCells(16)).toBe('whole');
		expect(durationForCells(5)).toBeUndefined();
		expect(durationForCells(7)).toBeUndefined();
	});

	test('maps durations to cell counts', () => {
		expect(cellsForDuration('sixteenth')).toBe(1);
		expect(cellsForDuration('eighth')).toBe(2);
		expect(cellsForDuration('dottedEighth')).toBe(3);
		expect(cellsForDuration('quarter')).toBe(4);
		expect(cellsForDuration('dottedQuarter')).toBe(6);
		expect(cellsForDuration('half')).toBe(8);
		expect(cellsForDuration('dottedHalf')).toBe(12);
		expect(cellsForDuration('whole')).toBe(16);
	});

	test('beat helpers for 4/4 sixteenth grid', () => {
		expect(beatIndex(0)).toBe(0);
		expect(beatIndex(3)).toBe(0);
		expect(beatIndex(4)).toBe(1);
		expect(beatIndex(15)).toBe(3);
		expect(cellsUntilBeatEnd(0)).toBe(4);
		expect(cellsUntilBeatEnd(2)).toBe(2);
		expect(cellsUntilBeatEnd(5)).toBe(3);
		expect(isHalfBarBoundary(HALF_BAR_CELL)).toBe(true);
		expect(isHalfBarBoundary(0)).toBe(false);
	});

	test('min cell unit matches subdivision level', () => {
		expect(minCellUnitForLevel('quarters')).toBe(4);
		expect(minCellUnitForLevel('eighths')).toBe(2);
		expect(minCellUnitForLevel('sixteenths')).toBe(1);
	});
});
