import { describe, expect, test } from 'bun:test';
import { statusToastForTransition } from '../status-toast';
import type { StatusToastSnapshot } from '../status-toast';

const base: StatusToastSnapshot = {
	showNextMeasure: true,
	demoBeforePlay: false,
	poisonMode: 'visible',
	rhythmRenderMode: 'grid',
	scrollDirection: 'none',
	gameMode: 'default',
	endless: false,
	subdivisionLevel: 'eighths',
	muteMetronome: false,
	mutePlayback: false,
	mutePreview: false,
};

describe('statusToastForTransition', () => {
	test('returns null when nothing changed', () => {
		expect(statusToastForTransition(base, base)).toBeNull();
	});

	test('practice toggles and subdivision', () => {
		expect(
			statusToastForTransition(base, {
				...base,
				showNextMeasure: false,
			}),
		).toBe('Show Next Measure: Off');
		expect(
			statusToastForTransition(base, {
				...base,
				demoBeforePlay: true,
			}),
		).toBe('Listen Before You Play: On');
		expect(
			statusToastForTransition(base, {
				...base,
				subdivisionLevel: 'sixteenths',
			}),
		).toBe('Show Notes: Sixteenth Notes');
	});

	test('display mode wins over scrollDirection companion change', () => {
		expect(
			statusToastForTransition(base, {
				...base,
				rhythmRenderMode: 'scroll',
				scrollDirection: 'down',
			}),
		).toBe('Display: Scroll');
		expect(
			statusToastForTransition(
				{ ...base, rhythmRenderMode: 'scroll', scrollDirection: 'down' },
				{ ...base, rhythmRenderMode: 'scroll', scrollDirection: 'left' },
			),
		).toBe('Scroll: Left');
	});

	test('poison and play mode', () => {
		expect(
			statusToastForTransition(base, { ...base, poisonMode: 'hidden' }),
		).toBe('Poison: Hidden During Playback');
		expect(
			statusToastForTransition(base, {
				...base,
				gameMode: 'bucketTrainer',
			}),
		).toBe('Play Mode: Bucket Drumming');
		expect(statusToastForTransition(base, { ...base, endless: true })).toBe(
			'Endless: On',
		);
	});

	test('coalesces mute-all and restore', () => {
		expect(
			statusToastForTransition(base, {
				...base,
				muteMetronome: true,
				mutePlayback: true,
				mutePreview: true,
			}),
		).toBe('All Channels Muted');
		expect(
			statusToastForTransition(
				{
					...base,
					muteMetronome: true,
					mutePlayback: true,
					mutePreview: true,
				},
				base,
			),
		).toBe('Channels Restored');
	});

	test('coalesces playback + preview mute pair', () => {
		expect(
			statusToastForTransition(base, {
				...base,
				mutePlayback: true,
				mutePreview: true,
			}),
		).toBe('Playback and Preview Muted');
	});

	test('single mute channel', () => {
		expect(
			statusToastForTransition(base, { ...base, muteMetronome: true }),
		).toBe('Metronome Muted');
		expect(
			statusToastForTransition(
				{ ...base, mutePreview: true },
				{ ...base, mutePreview: false },
			),
		).toBe('Preview Unmuted');
	});
});
