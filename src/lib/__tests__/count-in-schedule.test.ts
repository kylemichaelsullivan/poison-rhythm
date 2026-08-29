import { describe, expect, test } from 'bun:test';
import { planCountIn } from '../count-in-schedule';
import { AUDIO_SCHEDULE_LEAD_SEC, COUNT_IN_BEATS } from '../metronome-defaults';
import { createPlaybackClock } from '../playback-clock';

describe('planCountIn', () => {
	test('spaces four quarter clicks at the given tempo then starts playback on the next beat', () => {
		const tempo = 120;
		const audioNow = 10;
		const { beatTimes, playbackAt } = planCountIn(tempo, audioNow);
		const [beat0, beat1, beat2, beat3] = beatTimes;

		expect(beatTimes).toHaveLength(COUNT_IN_BEATS);
		expect(beat0).toBeCloseTo(audioNow + AUDIO_SCHEDULE_LEAD_SEC);
		expect(beat1).toBeDefined();
		expect(beat2).toBeDefined();
		expect(beat3).toBeDefined();
		expect((beat1 ?? 0) - (beat0 ?? 0)).toBeCloseTo(0.5);
		expect((beat2 ?? 0) - (beat1 ?? 0)).toBeCloseTo(0.5);
		expect((beat3 ?? 0) - (beat2 ?? 0)).toBeCloseTo(0.5);
		expect(playbackAt - (beat3 ?? 0)).toBeCloseTo(0.5);
	});

	test('matches the playback clock join so count-in and playback share one timeline', () => {
		const tempo = 96;
		const audioNow = 3;
		const planned = planCountIn(tempo, audioNow);
		const clock = createPlaybackClock({
			tempo,
			subdivisionLevel: 'quarters',
			countInEnabled: true,
			audioNow,
		});
		const lastBeat = planned.beatTimes[3];

		expect(planned.beatTimes).toEqual(clock.countInBeatTimes);
		expect(planned.playbackAt).toBe(clock.firstPlaybackAt);
		expect(lastBeat).toBeDefined();
		expect(planned.playbackAt - (lastBeat ?? 0)).toBeCloseTo(60 / tempo);
	});

	test('scales intervals with tempo', () => {
		const { beatTimes, playbackAt } = planCountIn(60, 0, { leadSec: 0 });

		expect(beatTimes[0]).toBe(0);
		expect(beatTimes[1]).toBeCloseTo(1);
		expect(playbackAt).toBeCloseTo(4);
	});
});
