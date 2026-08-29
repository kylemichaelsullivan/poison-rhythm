import { describe, expect, test } from 'bun:test';
import {
	shouldPlayRhythmAudio,
	shouldShowVisualFeedback,
} from '@/lib/audio/audio-engine';

describe('demo playback audio gating', () => {
	test('demo pass plays rhythm when not muted', () => {
		expect(shouldPlayRhythmAudio('demo', false, false)).toBe(true);
	});

	test('student pass muted when muteOnStudentPass is on', () => {
		expect(shouldPlayRhythmAudio('student', true, false)).toBe(false);
	});

	test('student pass plays when muteOnStudentPass is off', () => {
		expect(shouldPlayRhythmAudio('student', false, false)).toBe(true);
	});

	test('rhythm sounds are independent of visual feedback mode', () => {
		expect(shouldPlayRhythmAudio('demo', false, false)).toBe(true);
	});

	test('muteRhythmSounds silences hits', () => {
		expect(shouldPlayRhythmAudio('demo', false, true)).toBe(false);
	});

	test('shouldShowVisualFeedback for visual and both', () => {
		expect(shouldShowVisualFeedback('visual')).toBe(true);
		expect(shouldShowVisualFeedback('both')).toBe(true);
		expect(shouldShowVisualFeedback('audio')).toBe(false);
	});
});
