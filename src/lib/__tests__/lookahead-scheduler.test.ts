import { describe, expect, test } from 'bun:test';
import {
	createLookaheadScheduler,
	drainDueEvents,
} from '../lookahead-scheduler';
import { LOOKAHEAD_INTERVAL_MS } from '../metronome-defaults';

describe('drainDueEvents', () => {
	test('dispatches every event inside the look-ahead horizon', () => {
		const times = [0.05, 0.1, 0.2, 0.4];
		let index = 0;
		const dispatched: number[] = [];

		const count = drainDueEvents({
			peekNextTime: () => times[index] ?? 999,
			onDue: () => {
				const next = times[index];
				if (next === undefined) return undefined;
				dispatched.push(next);
				index += 1;
				return undefined;
			},
			audioNow: 0,
			scheduleAheadSec: 0.12,
		});

		expect(count).toBe(2);
		expect(dispatched).toEqual([0.05, 0.1]);
	});

	test('stops draining when onDue pauses at a bar boundary', () => {
		const times = [0.01, 0.02, 0.03];
		let index = 0;
		const dispatched: number[] = [];

		drainDueEvents({
			peekNextTime: () => times[index] ?? 999,
			onDue: () => {
				const next = times[index];
				if (next === undefined) return undefined;
				dispatched.push(next);
				index += 1;
				return index === 1 ? 'pause' : undefined;
			},
			audioNow: 0,
			scheduleAheadSec: 1,
		});

		expect(dispatched).toEqual([0.01]);
	});
});

describe('createLookaheadScheduler', () => {
	test('ticks immediately on start and again on each interval', () => {
		let audioNow = 0;
		let handler: () => void = () => {};
		let cleared = false;
		const dueTimes = [0.04, 0.2];
		let index = 0;
		const dispatched: number[] = [];

		const scheduler = createLookaheadScheduler({
			getAudioTime: () => audioNow,
			peekNextTime: () => dueTimes[index] ?? 999,
			onDue: () => {
				const next = dueTimes[index];
				if (next === undefined) return undefined;
				dispatched.push(next);
				index += 1;
				return undefined;
			},
			scheduleAheadSec: 0.1,
			intervalMs: LOOKAHEAD_INTERVAL_MS,
			setIntervalFn: (nextHandler) => {
				handler = nextHandler;
				return 1;
			},
			clearIntervalFn: () => {
				cleared = true;
			},
		});

		scheduler.start();
		expect(dispatched).toEqual([0.04]);

		audioNow = 0.15;
		handler();
		expect(dispatched).toEqual([0.04, 0.2]);

		scheduler.stop();
		expect(cleared).toBe(true);
	});
});
