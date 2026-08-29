import { describe, expect, test } from 'bun:test';
import { drainDueEvents } from '../lookahead-scheduler';
import {
	AUDIO_SCHEDULE_LEAD_SEC,
	COUNT_IN_BEATS,
	SCHEDULE_AHEAD_SEC,
} from '../metronome-defaults';
import type { PlaybackClock, PlaybackClockEvent } from '../playback-clock';
import {
	createPlaybackClock,
	quarterNoteSec,
	shouldHoldLookaheadAfterEvent,
} from '../playback-clock';

function collect(clock: PlaybackClock, count: number) {
	return Array.from({ length: count }, () => clock.advance());
}

function requireEvent(
	events: PlaybackClockEvent[],
	index: number,
): PlaybackClockEvent {
	const event = events[index];
	expect(event).toBeDefined();
	if (!event) {
		throw new Error(`missing event at ${index}`);
	}
	return event;
}

describe('createPlaybackClock', () => {
	test('joins count-in to playback with exactly one quarter-note interval', () => {
		const tempo = 120;
		const clock = createPlaybackClock({
			tempo,
			subdivisionLevel: 'sixteenths',
			countInEnabled: true,
			audioNow: 10,
			leadSec: 0,
		});
		const events = collect(clock, COUNT_IN_BEATS + 1);
		const countIn = events.filter((event) => event.phase === 'count-in');
		const firstPlayback = events.find((event) => event.phase === 'playback');

		expect(countIn).toHaveLength(COUNT_IN_BEATS);
		expect(firstPlayback).toBeDefined();
		expect(firstPlayback?.index).toBe(0);
		expect(
			(firstPlayback?.audioTime ?? 0) - requireEvent(countIn, 3).audioTime,
		).toBeCloseTo(quarterNoteSec(tempo));
		expect(firstPlayback?.audioTime).toBeCloseTo(clock.firstPlaybackAt);
		expect(firstPlayback?.audioTime).toBeCloseTo(10 + COUNT_IN_BEATS * 0.5);
	});

	test('does not insert the audio lead between the last count-in click and playback', () => {
		const clock = createPlaybackClock({
			tempo: 90,
			subdivisionLevel: 'eighths',
			countInEnabled: true,
			audioNow: 0,
			leadSec: AUDIO_SCHEDULE_LEAD_SEC,
		});
		const events = collect(clock, COUNT_IN_BEATS + 1);
		const lastCountIn = requireEvent(events, COUNT_IN_BEATS - 1);
		const firstPlayback = requireEvent(events, COUNT_IN_BEATS);

		expect(lastCountIn.phase).toBe('count-in');
		expect(firstPlayback.phase).toBe('playback');
		expect(firstPlayback.audioTime - lastCountIn.audioTime).toBeCloseTo(
			clock.quarterSec,
		);
		expect(firstPlayback.audioTime - lastCountIn.audioTime).not.toBeCloseTo(
			clock.quarterSec + AUDIO_SCHEDULE_LEAD_SEC,
		);
	});

	test('spaces playback steps at the subdivision pulse after the join', () => {
		const clock = createPlaybackClock({
			tempo: 120,
			subdivisionLevel: 'sixteenths',
			countInEnabled: true,
			audioNow: 0,
			leadSec: 0,
		});
		const events = collect(clock, COUNT_IN_BEATS + 4);
		const playback = events.filter((event) => event.phase === 'playback');
		const a = requireEvent(playback, 0);
		const b = requireEvent(playback, 1);
		const c = requireEvent(playback, 2);
		const d = requireEvent(playback, 3);

		expect(b.audioTime - a.audioTime).toBeCloseTo(0.125);
		expect(c.audioTime - b.audioTime).toBeCloseTo(0.125);
		expect(d.audioTime - c.audioTime).toBeCloseTo(0.125);
	});

	test('skips count-in when disabled and starts on the lead downbeat', () => {
		const clock = createPlaybackClock({
			tempo: 120,
			subdivisionLevel: 'quarters',
			countInEnabled: false,
			audioNow: 5,
		});
		const first = clock.advance();

		expect(first.phase).toBe('playback');
		expect(first.index).toBe(0);
		expect(first.audioTime).toBeCloseTo(5 + AUDIO_SCHEDULE_LEAD_SEC);
		expect(clock.countInBeatTimes).toEqual([]);
	});

	test('marks the last playback step of a bar and does not hold after count-in', () => {
		const clock = createPlaybackClock({
			tempo: 120,
			subdivisionLevel: 'quarters',
			countInEnabled: true,
			audioNow: 0,
			leadSec: 0,
		});
		const events = collect(clock, COUNT_IN_BEATS + 4);
		const lastCountIn = requireEvent(events, COUNT_IN_BEATS - 1);
		const lastPlayback = requireEvent(events, COUNT_IN_BEATS + 3);

		expect(lastCountIn.isLastStepInBar).toBe(true);
		expect(shouldHoldLookaheadAfterEvent(lastCountIn, true)).toBe(false);
		expect(lastPlayback.phase).toBe('playback');
		expect(lastPlayback.index).toBe(3);
		expect(lastPlayback.isLastStepInBar).toBe(true);
		expect(shouldHoldLookaheadAfterEvent(lastPlayback, true)).toBe(true);
		expect(shouldHoldLookaheadAfterEvent(lastPlayback, false)).toBe(false);
	});
});

describe('count-in look-ahead drain', () => {
	test('schedules the first playback beat before it is due on the audio clock', () => {
		const clock = createPlaybackClock({
			tempo: 120,
			subdivisionLevel: 'quarters',
			countInEnabled: true,
			audioNow: 0,
			leadSec: AUDIO_SCHEDULE_LEAD_SEC,
		});
		const events: PlaybackClockEvent[] = [];
		const firstPlaybackAt = AUDIO_SCHEDULE_LEAD_SEC + COUNT_IN_BEATS * 0.5;
		const audioNow = firstPlaybackAt - 0.05;

		drainDueEvents({
			peekNextTime: () => clock.peek().audioTime,
			onDue: () => {
				events.push(clock.advance());
				return undefined;
			},
			audioNow,
			scheduleAheadSec: SCHEDULE_AHEAD_SEC,
		});

		const firstPlayback = events.find((event) => event.phase === 'playback');
		expect(firstPlayback).toBeDefined();
		expect(firstPlayback?.audioTime).toBeCloseTo(firstPlaybackAt);
		expect(firstPlayback?.audioTime ?? 0).toBeGreaterThan(audioNow);
	});
});
