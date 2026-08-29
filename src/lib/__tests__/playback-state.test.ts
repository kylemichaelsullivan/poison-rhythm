import { describe, expect, test } from 'bun:test';
import {
	initialPlaybackPass,
	isMeasuresPlaying,
	measureForPlaybackPass,
	nextPassAfterBar,
	shouldHighlightPlaybackStep,
	shouldRunCountIn,
} from '../playback-state';

describe('playback-state', () => {
	test('isMeasuresPlaying is false during count-in', () => {
		expect(
			isMeasuresPlaying({
				activeSource: 'measures',
				isCountingIn: true,
				playbackPass: null,
			}),
		).toBe(false);
	});

	test('isMeasuresPlaying is false before pass starts (startup race window)', () => {
		expect(
			isMeasuresPlaying({
				activeSource: 'measures',
				isCountingIn: false,
				playbackPass: null,
			}),
		).toBe(false);
	});

	test('isMeasuresPlaying is true once a preview or student pass is active', () => {
		expect(
			isMeasuresPlaying({
				activeSource: 'measures',
				isCountingIn: false,
				playbackPass: 'demo',
			}),
		).toBe(true);
		expect(
			isMeasuresPlaying({
				activeSource: 'measures',
				isCountingIn: false,
				playbackPass: 'student',
			}),
		).toBe(true);
	});

	test('isMeasuresPlaying is false for metronome-only or stopped', () => {
		expect(
			isMeasuresPlaying({
				activeSource: 'metronome',
				isCountingIn: false,
				playbackPass: 'student',
			}),
		).toBe(false);
		expect(
			isMeasuresPlaying({
				activeSource: null,
				isCountingIn: false,
				playbackPass: null,
			}),
		).toBe(false);
	});

	test('shouldHighlightPlaybackStep only when playing the matching cell', () => {
		expect(
			shouldHighlightPlaybackStep({
				playbackEnabled: true,
				isMeasuresPlaying: true,
				cellStep: 0,
				subdivisionIndex: 0,
				showVisual: true,
			}),
		).toBe(true);

		expect(
			shouldHighlightPlaybackStep({
				playbackEnabled: true,
				isMeasuresPlaying: false,
				cellStep: 0,
				subdivisionIndex: 0,
				showVisual: true,
			}),
		).toBe(false);

		expect(
			shouldHighlightPlaybackStep({
				playbackEnabled: true,
				isMeasuresPlaying: true,
				cellStep: 0,
				subdivisionIndex: 1,
				showVisual: true,
			}),
		).toBe(false);

		expect(
			shouldHighlightPlaybackStep({
				playbackEnabled: false,
				isMeasuresPlaying: true,
				cellStep: 0,
				subdivisionIndex: 0,
				showVisual: true,
			}),
		).toBe(false);
	});

	test('initialPlaybackPass chooses preview (demo) when enabled', () => {
		expect(initialPlaybackPass(true)).toBe('demo');
		expect(initialPlaybackPass(false)).toBe('student');
	});

	test('measureForPlaybackPass uses the current carousel measure for both passes', () => {
		const poison = [
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		] as const;
		const current = [
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
		] as const;

		expect(measureForPlaybackPass('demo', [...poison], [...current])).toEqual([
			...current,
		]);
		expect(
			measureForPlaybackPass('student', [...poison], [...current]),
		).toEqual([...current]);
		expect(measureForPlaybackPass('demo', null, [...current])).toEqual([
			...current,
		]);
	});

	test('shouldRunCountIn only for measure playback with count-in on', () => {
		expect(shouldRunCountIn('measures', true)).toBe(true);
		expect(shouldRunCountIn('measures', false)).toBe(false);
		expect(shouldRunCountIn('metronome', true)).toBe(false);
		expect(shouldRunCountIn(null, true)).toBe(false);
	});

	test('nextPassAfterBar toggles demo/student without skipping a measure', () => {
		expect(nextPassAfterBar('student', false)).toEqual({
			pass: 'student',
			bumpCycle: true,
		});
		expect(nextPassAfterBar('demo', true)).toEqual({
			pass: 'student',
			bumpCycle: false,
		});
		expect(nextPassAfterBar('student', true)).toEqual({
			pass: 'demo',
			bumpCycle: true,
		});
	});
});
