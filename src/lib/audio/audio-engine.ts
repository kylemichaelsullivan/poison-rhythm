import { BEAT_FLASH_MS } from '@/lib/metronome-defaults';

/** Web Audio gain ramps are inaudible when scheduled in the past — clamp to now. */
export function clampScheduleTime(audioNow: number, time: number): number {
	return Math.max(time, audioNow);
}

/**
 * Future notes must be silenced on stop/pause; notes already in their envelope
 * should finish so poison / end-of-round does not chop the last hit.
 */
export function shouldCancelScheduledSource(
	audioNow: number,
	startTime: number,
): boolean {
	return startTime > audioNow;
}

function scheduleTime(context: AudioContext, time: number): number {
	return clampScheduleTime(context.currentTime, time);
}

export type HitOptions = {
	accent?: boolean;
	isPoison?: boolean;
};

type TrackedSource = {
	oscillator: OscillatorNode;
	startTime: number;
};

export type AudioEngine = {
	getContext: () => AudioContext;
	scheduleClick: (time: number) => void;
	scheduleHit: (time: number, options?: HitOptions) => void;
	/**
	 * Cancel oscillators scheduled in the future (pause / stop).
	 * Sources already sounding keep their natural envelope.
	 */
	cancelScheduled: () => void;
	closeIfOpen: () => void;
};

export function createAudioEngine(): AudioEngine {
	let audioContext: AudioContext | null = null;
	let scheduledSources: TrackedSource[] = [];

	const getContext = (): AudioContext => {
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		return audioContext;
	};

	const track = (oscillator: OscillatorNode, startTime: number): void => {
		scheduledSources.push({ oscillator, startTime });
		oscillator.addEventListener('ended', () => {
			scheduledSources = scheduledSources.filter(
				(entry) => entry.oscillator !== oscillator,
			);
		});
	};

	const cancelScheduled = (): void => {
		const audioNow = audioContext?.currentTime ?? 0;
		const remaining: TrackedSource[] = [];
		for (const entry of scheduledSources) {
			if (!shouldCancelScheduledSource(audioNow, entry.startTime)) {
				remaining.push(entry);
				continue;
			}
			try {
				entry.oscillator.stop();
			} catch {
				// Already stopped or never started.
			}
		}
		scheduledSources = remaining;
	};

	const closeIfOpen = (): void => {
		for (const entry of scheduledSources) {
			try {
				// Unmount tear-down silences everything, including in-flight notes.
				entry.oscillator.stop();
			} catch {
				// Already stopped or never started.
			}
		}
		scheduledSources = [];
		if (audioContext && audioContext.state !== 'closed') {
			void audioContext.close();
		}
		audioContext = null;
	};

	const scheduleClick = (time: number): void => {
		const context = getContext();
		const startTime = scheduleTime(context, time);
		const duration = BEAT_FLASH_MS / 1000;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = 'sine';
		gain.gain.setValueAtTime(0, startTime);
		gain.gain.linearRampToValueAtTime(0.2, startTime + 0.002);
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
		oscillator.connect(gain);
		gain.connect(context.destination);
		track(oscillator, startTime);
		oscillator.start(startTime);
		oscillator.stop(startTime + duration + 0.01);
	};

	const scheduleHit = (time: number, options: HitOptions = {}): void => {
		const context = getContext();
		const startTime = scheduleTime(context, time);
		const duration = BEAT_FLASH_MS / 1000;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = 'triangle';

		const frequency = options.accent ? 880 : options.isPoison ? 440 : 660;
		const peakGain = options.accent ? 0.35 : options.isPoison ? 0.2 : 0.28;

		oscillator.frequency.setValueAtTime(frequency, startTime);
		gain.gain.setValueAtTime(0, startTime);
		gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
		oscillator.connect(gain);
		gain.connect(context.destination);
		track(oscillator, startTime);
		oscillator.start(startTime);
		oscillator.stop(startTime + duration + 0.01);
	};

	return {
		getContext,
		scheduleClick,
		scheduleHit,
		cancelScheduled,
		closeIfOpen,
	};
}

/** Rhythm hit sounds follow mute prefs, not visual feedback mode (see Sound settings). */
export function shouldPlayRhythmAudio(
	playbackPass: 'demo' | 'student',
	muteOnStudentPass: boolean,
	muteRhythmSounds: boolean,
): boolean {
	if (muteRhythmSounds) return false;
	if (playbackPass === 'student' && muteOnStudentPass) return false;
	return true;
}

export function shouldShowVisualFeedback(
	feedbackMode: 'none' | 'visual' | 'audio' | 'both',
): boolean {
	return feedbackMode === 'visual' || feedbackMode === 'both';
}
