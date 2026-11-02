import { describe, expect, test } from 'bun:test';
import {
	shouldPlayRhythmAudio,
	shouldShowVisualFeedback,
} from '@/lib/audio/audio-engine';

describe('demo playback audio gating', () => {
	test('demo pass plays rhythm when not muted', () => {
		expect(shouldPlayRhythmAudio('demo', false, false)).toBe(true);
	});

	test('student pass muted when Playback is muted', () => {
		expect(shouldPlayRhythmAudio('student', false, true)).toBe(false);
	});

	test('student pass plays when Playback is unmuted', () => {
		expect(shouldPlayRhythmAudio('student', false, false)).toBe(true);
	});

	test('demo pass muted when Preview is muted', () => {
		expect(shouldPlayRhythmAudio('demo', true, true)).toBe(false);
	});

	test('demo pass plays when Preview is unmuted even if Playback is muted', () => {
		expect(shouldPlayRhythmAudio('demo', false, true)).toBe(true);
	});

	test('rhythm sounds are independent of visual feedback mode', () => {
		expect(shouldPlayRhythmAudio('demo', false, false)).toBe(true);
	});

	test('shouldShowVisualFeedback for visual and both', () => {
		expect(shouldShowVisualFeedback('visual')).toBe(true);
		expect(shouldShowVisualFeedback('both')).toBe(true);
		expect(shouldShowVisualFeedback('audio')).toBe(false);
	});
});
