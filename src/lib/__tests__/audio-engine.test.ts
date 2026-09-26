import { describe, expect, test } from 'bun:test';
import {
	clampScheduleTime,
	shouldCancelScheduledSource,
} from '../audio/audio-engine';

describe('clampScheduleTime', () => {
	test('keeps future schedule times', () => {
		expect(clampScheduleTime(1, 1.5)).toBe(1.5);
	});

	test('clamps past schedule times to now', () => {
		expect(clampScheduleTime(2, 1.25)).toBe(2);
	});
});

describe('shouldCancelScheduledSource', () => {
	test('cancels notes scheduled in the future', () => {
		expect(shouldCancelScheduledSource(1, 1.05)).toBe(true);
	});

	test('keeps notes that have already started so envelopes can finish', () => {
		expect(shouldCancelScheduledSource(1, 1)).toBe(false);
		expect(shouldCancelScheduledSource(1.02, 1)).toBe(false);
	});
});
