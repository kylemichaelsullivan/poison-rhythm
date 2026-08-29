import { describe, expect, test } from 'bun:test';
import { drainDueEvents } from '../../lookahead-scheduler';
import {
	measureCompleteAction,
	shouldProcessMeasureCycle,
} from '../../measure-playback';
import { COUNT_IN_BEATS, SCHEDULE_AHEAD_SEC } from '../../metronome-defaults';
import type { PlaybackClockEvent } from '../../playback-clock';
import { createPlaybackClock, quarterNoteSec } from '../../playback-clock';
import type { PlaybackPass, PlaybackSource } from '../../playback-state';
import {
	initialPlaybackPass,
	isMeasuresPlaying,
	measureForPlaybackPass,
	shouldHighlightPlaybackStep,
	shouldRunCountIn,
} from '../../playback-state';

type PlaybackSnapshot = {
	activeSource: PlaybackSource | null;
	isCountingIn: boolean;
	playbackPass: PlaybackPass | null;
	subdivisionIndex: number;
};

function highlightFirstCell(state: PlaybackSnapshot): boolean {
	return shouldHighlightPlaybackStep({
		playbackEnabled: true,
		isMeasuresPlaying: isMeasuresPlaying(state),
		cellStep: 0,
		subdivisionIndex: state.subdivisionIndex,
		showVisual: true,
	});
}

/**
 * Integration: count-in → preview/student pass → highlight → measure advance.
 * Mirrors MetronomeProvider transitions without React or Web Audio.
 */
describe('playback flow integration', () => {
	test('does not highlight the first note during count-in', () => {
		const countingIn: PlaybackSnapshot = {
			activeSource: 'measures',
			isCountingIn: true,
			playbackPass: null,
			subdivisionIndex: 0,
		};

		expect(highlightFirstCell(countingIn)).toBe(false);
	});

	test('does not highlight in the pre-count-in race window', () => {
		const raceWindow: PlaybackSnapshot = {
			activeSource: 'measures',
			isCountingIn: false,
			playbackPass: null,
			subdivisionIndex: 0,
		};

		expect(highlightFirstCell(raceWindow)).toBe(false);
	});

	test('highlights first note only after playback pass starts', () => {
		const afterCountIn: PlaybackSnapshot = {
			activeSource: 'measures',
			isCountingIn: false,
			playbackPass: 'student',
			subdivisionIndex: 0,
		};

		expect(highlightFirstCell(afterCountIn)).toBe(true);
	});

	test('preview-before-play starts with demo pass then student for each measure', () => {
		expect(shouldRunCountIn('measures', true)).toBe(true);

		const previewPass = initialPlaybackPass(true);
		expect(previewPass).toBe('demo');

		const poison = Array.from({ length: 16 }, (_, i) => i === 0);
		const firstStream = Array.from({ length: 16 }, (_, i) => i === 2);

		expect(measureForPlaybackPass(previewPass, poison, firstStream)).toEqual(
			firstStream,
		);

		const previewing: PlaybackSnapshot = {
			activeSource: 'measures',
			isCountingIn: false,
			playbackPass: previewPass,
			subdivisionIndex: 0,
		};
		expect(isMeasuresPlaying(previewing)).toBe(true);
		expect(highlightFirstCell(previewing)).toBe(true);

		const student: PlaybackSnapshot = {
			...previewing,
			playbackPass: 'student',
		};
		expect(isMeasuresPlaying(student)).toBe(true);
		expect(measureForPlaybackPass('student', poison, firstStream)).toEqual(
			firstStream,
		);
	});

	test('count-in off skips count-in and starts the chosen pass immediately', () => {
		expect(shouldRunCountIn('measures', false)).toBe(false);

		const immediate: PlaybackSnapshot = {
			activeSource: 'measures',
			isCountingIn: false,
			playbackPass: initialPlaybackPass(false),
			subdivisionIndex: 0,
		};

		expect(immediate.playbackPass).toBe('student');
		expect(highlightFirstCell(immediate)).toBe(true);
	});

	test('measure cycle advances only while actively playing', () => {
		expect(shouldProcessMeasureCycle(false, 1, 0)).toBe(false);
		expect(shouldProcessMeasureCycle(true, 1, 0)).toBe(true);
		expect(shouldProcessMeasureCycle(true, 1, 1)).toBe(false);

		expect(
			measureCompleteAction({
				currentIndex: 0,
				measuresLength: 3,
				isPoisonMeasure: false,
				shouldStopGame: false,
			}),
		).toBe('advance');

		expect(
			measureCompleteAction({
				currentIndex: 2,
				measuresLength: 3,
				isPoisonMeasure: false,
				shouldStopGame: false,
			}),
		).toBe('stop');
	});

	test('count-in and first playback land on one continuous audio timeline', () => {
		const tempo = 100;
		const clock = createPlaybackClock({
			tempo,
			subdivisionLevel: 'eighths',
			countInEnabled: true,
			audioNow: 1,
			leadSec: 0.08,
		});
		const events: PlaybackClockEvent[] = [];
		drainDueEvents({
			peekNextTime: () => clock.peek().audioTime,
			onDue: () => {
				events.push(clock.advance());
				return undefined;
			},
			audioNow: 1,
			scheduleAheadSec: 0.08 + COUNT_IN_BEATS * quarterNoteSec(tempo) + 0.01,
		});

		const countIn = events.filter((event) => event.phase === 'count-in');
		const playback = events.filter((event) => event.phase === 'playback');

		const lastCountIn = countIn[3];
		const firstPlayback = playback[0];

		expect(shouldRunCountIn('measures', true)).toBe(true);
		expect(countIn).toHaveLength(COUNT_IN_BEATS);
		expect(firstPlayback).toBeDefined();
		expect(lastCountIn).toBeDefined();
		expect(
			(firstPlayback?.audioTime ?? 0) - (lastCountIn?.audioTime ?? 0),
		).toBeCloseTo(quarterNoteSec(tempo));
		expect(firstPlayback?.audioTime).toBeCloseTo(clock.firstPlaybackAt);
		expect(SCHEDULE_AHEAD_SEC).toBeGreaterThan(0);
	});
});
