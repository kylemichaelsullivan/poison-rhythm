import { describe, expect, test } from 'bun:test';
import { clampScheduleTime } from '../audio/audio-engine';

describe('clampScheduleTime', () => {
	test('keeps future schedule times', () => {
		expect(clampScheduleTime(1, 1.5)).toBe(1.5);
	});

	test('clamps past schedule times to now', () => {
		expect(clampScheduleTime(2, 1.25)).toBe(2);
	});
});
