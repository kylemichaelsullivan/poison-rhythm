import type { ReactNode } from 'react';
import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	BEAT_FLASH_MS,
	BPM_DEFAULT,
	BPM_MAX,
	BPM_MIN,
	COUNT_IN_BEATS,
} from '@/lib/metronome-defaults';
import { clampTempo, getInitialTempo } from '@/lib/metronome-tempo';
import {
	isQuarterDownbeat,
	stepHasHit,
	subdivisionPulseDivisor,
	subdivisionStepCount,
} from '@/lib/subdivision-playback';
import type { RhythmMeasure } from '@/types';
import { useTheme } from './ThemeContext';

export type PlaybackSource = 'metronome' | 'measures';

type MetronomeContextValue = {
	tempo: number;
	activeSource: PlaybackSource | null;
	isRunning: boolean;
	isMetronomeRunning: boolean;
	isMeasuresRunning: boolean;
	isCountingIn: boolean;
	isMeasuresPlaying: boolean;
	isLit: boolean;
	subdivisionIndex: number;
	measureCycle: number;
	setPlaybackMeasure: (measure: RhythmMeasure | null) => void;
	toggleMetronome: () => void;
	toggleMeasures: () => void;
	startMetronome: () => void;
	stop: () => void;
	handleTempoChange: (updated: number) => void;
	setTempo: Dispatch<SetStateAction<number>>;
};

const MetronomeContext = createContext<MetronomeContextValue | null>(null);

type MetronomeProviderProps = {
	children: ReactNode;
};

function isEditableTarget(target: EventTarget | null) {
	return (
		target instanceof HTMLElement &&
		(target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.tagName === 'SELECT' ||
			target.isContentEditable ||
			target.closest('button, a[href], [role="button"], [role="dialog"]') !==
				null)
	);
}

export function MetronomeProvider({ children }: MetronomeProviderProps) {
	const { subdivisionLevel, muteMetronome, muteRhythmSounds } = useTheme();
	const [tempo, setTempo] = useState(() => getInitialTempo(BPM_DEFAULT));
	const [activeSource, setActiveSource] = useState<PlaybackSource | null>(null);
	const [isCountingIn, setIsCountingIn] = useState(false);
	const [isLit, setIsLit] = useState(false);
	const [subdivisionIndex, setSubdivisionIndex] = useState(0);
	const [measureCycle, setMeasureCycle] = useState(0);
	const stepRef = useRef(0);
	const audioContextRef = useRef<AudioContext | null>(null);
	const playbackMeasureRef = useRef<RhythmMeasure | null>(null);
	const muteMetronomeRef = useRef(muteMetronome);
	const muteRhythmSoundsRef = useRef(muteRhythmSounds);
	muteMetronomeRef.current = muteMetronome;
	muteRhythmSoundsRef.current = muteRhythmSounds;

	const setPlaybackMeasure = useCallback((measure: RhythmMeasure | null) => {
		playbackMeasureRef.current = measure;
	}, []);

	const isRunning = activeSource !== null;
	const isMetronomeRunning = activeSource === 'metronome';
	const isMeasuresRunning = activeSource === 'measures';
	const isMeasuresPlaying = isMeasuresRunning && !isCountingIn;

	const stop = useCallback(() => setActiveSource(null), []);

	const toggleMetronome = useCallback(() => {
		setActiveSource((source) => (source === null ? 'metronome' : null));
	}, []);

	const toggleMeasures = useCallback(() => {
		setActiveSource((source) => (source === null ? 'measures' : null));
	}, []);

	const startMetronome = useCallback(() => {
		setActiveSource('metronome');
	}, []);

	const handleTempoChange = useCallback(
		(updated: number) => {
			stop();
			setTempo(clampTempo(updated));
		},
		[stop],
	);

	useEffect(() => {
		return () => {
			void audioContextRef.current?.close();
			audioContextRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!isRunning || activeSource === null) {
			stepRef.current = 0;
			setIsCountingIn(false);
			setSubdivisionIndex(0);
			setMeasureCycle(0);
			return;
		}

		let cancelled = false;
		let intervalId: ReturnType<typeof setInterval> | null = null;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		const getAudioContext = () => {
			if (!audioContextRef.current) {
				audioContextRef.current = new AudioContext();
			}
			return audioContextRef.current;
		};

		const beep = () => {
			if (muteMetronomeRef.current) {
				return;
			}

			const context = getAudioContext();
			const now = context.currentTime;
			const duration = BEAT_FLASH_MS / 1000;
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			oscillator.type = 'sine';
			// Quick attack/decay envelope so the click has no pops at the edges
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.2, now + 0.002);
			gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start(now);
			oscillator.stop(now + duration + 0.01);
		};

		const rhythmHit = () => {
			if (muteRhythmSoundsRef.current) {
				return;
			}

			const context = getAudioContext();
			const now = context.currentTime;
			const duration = BEAT_FLASH_MS / 1000;
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(660, now);
			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.28, now + 0.002);
			gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start(now);
			oscillator.stop(now + duration + 0.01);
		};

		const flash = () => {
			setIsLit(true);
			setTimeout(() => {
				setIsLit(false);
			}, BEAT_FLASH_MS);
		};

		const startPlayback = () => {
			if (cancelled) {
				return;
			}

			setIsCountingIn(false);
			stepRef.current = 0;
			setSubdivisionIndex(0);
			setMeasureCycle(0);

			const stepCount = subdivisionStepCount(subdivisionLevel);
			const pulse =
				((60 / tempo) * 1000) / subdivisionPulseDivisor(subdivisionLevel);

			const beat = () => {
				const step = stepRef.current;
				setSubdivisionIndex(step);
				stepRef.current = (step + 1) % stepCount;

				if (step === stepCount - 1) {
					setMeasureCycle((cycle) => cycle + 1);
				}

				if (activeSource === 'measures') {
					const measure = playbackMeasureRef.current;
					if (
						measure &&
						stepHasHit(measure, subdivisionLevel, step)
					) {
						rhythmHit();
					}
				}

				if (isQuarterDownbeat(subdivisionLevel, step)) {
					beep();
					flash();
				}
			};

			beat();
			intervalId = setInterval(beat, pulse);
		};

		const clearTimers = () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
				intervalId = null;
			}
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};

		const startCountIn = () => {
			setIsCountingIn(true);
			stepRef.current = 0;
			setSubdivisionIndex(0);
			setMeasureCycle(0);

			const quarterMs = (60 / tempo) * 1000;
			let count = 0;

			const countInBeat = () => {
				beep();
				flash();
				count += 1;

				if (count >= COUNT_IN_BEATS) {
					clearTimers();
					// Next quarter after "4" is the first measure beat
					timeoutId = setTimeout(startPlayback, quarterMs);
				}
			};

			countInBeat();
			intervalId = setInterval(countInBeat, quarterMs);
		};

		const begin = () => {
			if (cancelled) {
				return;
			}

			if (activeSource === 'measures') {
				startCountIn();
			} else {
				setIsCountingIn(false);
				startPlayback();
			}
		};

		// Wait for the AudioContext to actually be running before scheduling
		// the first beat; beeps fired while the context is still resuming get
		// queued up and play back jumbled together.
		const context = getAudioContext();

		if (context.state === 'running') {
			begin();
		} else {
			void context.resume().then(begin);
		}

		return () => {
			cancelled = true;
			clearTimers();
		};
	}, [isRunning, activeSource, tempo, subdivisionLevel]);

	useEffect(() => {
		function handleKeyUp(e: KeyboardEvent) {
			if (isEditableTarget(e.target)) {
				return;
			}

			if (e.key === ' ' || e.key === 'Enter') {
				setActiveSource((source) => (source === null ? 'measures' : null));
				return;
			}

			if (e.key === 'Escape') {
				stop();
				return;
			}

			if (
				e.key !== 'ArrowLeft' &&
				e.key !== 'ArrowRight' &&
				e.key !== 'ArrowUp' &&
				e.key !== 'ArrowDown'
			) {
				return;
			}

			let nextTempo = tempo;

			if (e.key === 'ArrowLeft') {
				nextTempo = tempo - 5 >= BPM_MIN ? tempo - 5 : BPM_MIN;
			} else if (e.key === 'ArrowRight') {
				nextTempo = tempo + 5 <= BPM_MAX ? tempo + 5 : BPM_MAX;
			} else if (e.key === 'ArrowUp') {
				nextTempo = tempo + 1 <= BPM_MAX ? tempo + 1 : BPM_MAX;
			} else if (e.key === 'ArrowDown') {
				nextTempo = tempo - 1 >= BPM_MIN ? tempo - 1 : BPM_MIN;
			}

			handleTempoChange(nextTempo);
		}

		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [tempo, handleTempoChange, stop]);

	const value: MetronomeContextValue = {
		tempo,
		activeSource,
		isRunning,
		isMetronomeRunning,
		isMeasuresRunning,
		isCountingIn,
		isMeasuresPlaying,
		isLit,
		subdivisionIndex,
		measureCycle,
		setPlaybackMeasure,
		toggleMetronome,
		toggleMeasures,
		startMetronome,
		stop,
		handleTempoChange,
		setTempo,
	};

	return (
		<MetronomeContext.Provider value={value}>
			{children}
		</MetronomeContext.Provider>
	);
}

export function useMetronome(): MetronomeContextValue {
	const context = useContext(MetronomeContext);

	if (!context) {
		throw new Error('useMetronome must be used within MetronomeProvider');
	}

	return context;
}
