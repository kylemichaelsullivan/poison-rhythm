import { BEAT_FLASH_MS } from '@/lib/metronome-defaults';

/** Web Audio gain ramps are inaudible when scheduled in the past — clamp to now. */
export function clampScheduleTime(audioNow: number, time: number): number {
	return Math.max(time, audioNow);
}

function scheduleTime(context: AudioContext, time: number): number {
	return clampScheduleTime(context.currentTime, time);
}

export type HitOptions = {
	accent?: boolean;
	isPoison?: boolean;
};

export type AudioEngine = {
	getContext: () => AudioContext;
	scheduleClick: (time: number) => void;
	scheduleHit: (time: number, options?: HitOptions) => void;
	/** Stop any oscillators scheduled into the future (e.g. when pausing mid count-in). */
	cancelScheduled: () => void;
	closeIfOpen: () => void;
};

export function createAudioEngine(): AudioEngine {
	let audioContext: AudioContext | null = null;
	let scheduledSources: OscillatorNode[] = [];

	const getContext = (): AudioContext => {
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		return audioContext;
	};

	const track = (oscillator: OscillatorNode): void => {
		scheduledSources.push(oscillator);
		oscillator.addEventListener('ended', () => {
			scheduledSources = scheduledSources.filter((node) => node !== oscillator);
		});
	};

	const cancelScheduled = (): void => {
		for (const oscillator of scheduledSources) {
			try {
				oscillator.stop();
			} catch {
				// Already stopped or never started.
			}
		}
		scheduledSources = [];
	};

	const closeIfOpen = (): void => {
		cancelScheduled();
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
		track(oscillator);
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
		track(oscillator);
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
