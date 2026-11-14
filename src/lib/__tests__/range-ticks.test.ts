import { describe, expect, test } from 'bun:test';
import { inclusiveRangeTicks, rangeTickOffsetPercent } from '../range-ticks';

describe('range-ticks', () => {
	test('maps endpoints and midpoints along the thumb path', () => {
		expect(rangeTickOffsetPercent(1, 1, 5)).toBe(0);
		expect(rangeTickOffsetPercent(5, 1, 5)).toBe(100);
		expect(rangeTickOffsetPercent(3, 1, 5)).toBe(50);
		expect(rangeTickOffsetPercent(50, 50, 200)).toBe(0);
		expect(rangeTickOffsetPercent(200, 50, 200)).toBe(100);
	});

	test('returns 0 when the span is empty or inverted', () => {
		expect(rangeTickOffsetPercent(3, 5, 5)).toBe(0);
		expect(rangeTickOffsetPercent(3, 5, 1)).toBe(0);
	});

	test('builds inclusive integer ticks', () => {
		expect(inclusiveRangeTicks(1, 5)).toEqual([1, 2, 3, 4, 5]);
		expect(inclusiveRangeTicks(3, 3)).toEqual([3]);
		expect(inclusiveRangeTicks(5, 1)).toEqual([]);
	});
});
