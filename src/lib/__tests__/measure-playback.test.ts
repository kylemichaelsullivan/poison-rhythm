import { describe, expect, test } from 'bun:test';
import {
	measureCompleteAction,
	shouldProcessMeasureCycle,
} from '@/lib/measure-playback';

describe('shouldProcessMeasureCycle', () => {
	test('ignores cycle 0 and idle playback', () => {
		expect(shouldProcessMeasureCycle(true, 0, 0)).toBe(false);
		expect(shouldProcessMeasureCycle(false, 1, 0)).toBe(false);
	});

	test('handles each completed measure once', () => {
		expect(shouldProcessMeasureCycle(true, 1, 0)).toBe(true);
		expect(shouldProcessMeasureCycle(true, 1, 1)).toBe(false);
		expect(shouldProcessMeasureCycle(true, 2, 1)).toBe(true);
	});
});

describe('measureCompleteAction', () => {
	test('advances to the next measure when more remain', () => {
		expect(
			measureCompleteAction({
				currentIndex: 0,
				measuresLength: 4,
				isPoisonMeasure: false,
				shouldStopGame: false,
			}),
		).toBe('advance');
	});

	test('stops on poison, game-mode halt, or the last measure', () => {
		expect(
			measureCompleteAction({
				currentIndex: 1,
				measuresLength: 4,
				isPoisonMeasure: true,
				shouldStopGame: false,
			}),
		).toBe('stop');
		expect(
			measureCompleteAction({
				currentIndex: 0,
				measuresLength: 4,
				isPoisonMeasure: false,
				shouldStopGame: true,
			}),
		).toBe('stop');
		expect(
			measureCompleteAction({
				currentIndex: 3,
				measuresLength: 4,
				isPoisonMeasure: false,
				shouldStopGame: false,
			}),
		).toBe('stop');
	});
});
