import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
	MetronomeContextValue,
	PlaybackPass,
	PlaybackSource,
} from '@/contexts/MetronomeContext';
import { MetronomeContext } from '@/contexts/MetronomeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useSettings } from '@/contexts/SettingsContext';
import { createAudioEngine, shouldPlayRhythmAudio } from '@/lib/audio';
import type { LookaheadScheduler } from '@/lib/lookahead-scheduler';
import { createLookaheadScheduler } from '@/lib/lookahead-scheduler';
import { BEAT_FLASH_MS, BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { clampTempo } from '@/lib/metronome-tempo';
import type { PlaybackClockEvent } from '@/lib/playback-clock';
import {
	createPlaybackClock,
	shouldHoldLookaheadAfterEvent,
} from '@/lib/playback-clock';
import {
	isMeasuresPlaying as computeIsMeasuresPlaying,
	initialPlaybackPass,
	measureForPlaybackPass,
	nextPassAfterBar,
	shouldRunCountIn,
} from '@/lib/playback-state';
import { stepHasHit } from '@/lib/subdivision-playback';
import type { RhythmMeasure } from '@/types';

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
	const {
		subdivisionLevel,
		muteMetronome,
		countInEnabled,
		muteRhythmSounds,
		tempo,
		setTempo,
	} = usePreferences();
	const { settings } = useSettings();
	const [activeSource, setActiveSource] = useState<PlaybackSource | null>(null);
	const [isCountingIn, setIsCountingIn] = useState(false);
	const [countInBeat, setCountInBeat] = useState<number | null>(null);
	const [playbackPass, setPlaybackPass] = useState<PlaybackPass | null>(null);
	const [isLit, setIsLit] = useState(false);
	const [subdivisionIndex, setSubdivisionIndex] = useState(0);
	const [measureCycle, setMeasureCycle] = useState(0);
	const audioEngineRef = useRef(createAudioEngine());
	const playbackMeasureRef = useRef<RhythmMeasure | null>(null);
	const previewMeasureRef = useRef<RhythmMeasure | null>(null);
	const muteMetronomeRef = useRef(muteMetronome);
	const countInEnabledRef = useRef(countInEnabled);
	const muteRhythmSoundsRef = useRef(muteRhythmSounds);
	const settingsRef = useRef(settings);
	const activeSourceRef = useRef(activeSource);
	muteMetronomeRef.current = muteMetronome;
	countInEnabledRef.current = countInEnabled;
	muteRhythmSoundsRef.current = muteRhythmSounds;
	settingsRef.current = settings;
	activeSourceRef.current = activeSource;

	const setPlaybackMeasure = useCallback((measure: RhythmMeasure | null) => {
		playbackMeasureRef.current = measure;
	}, []);

	const setPreviewMeasure = useCallback((measure: RhythmMeasure | null) => {
		previewMeasureRef.current = measure;
	}, []);

	const isRunning = activeSource !== null;
	const isMetronomeRunning = activeSource === 'metronome';
	const isMeasuresRunning = activeSource === 'measures';
	const isMeasuresPlaying = computeIsMeasuresPlaying({
		activeSource,
		isCountingIn,
		playbackPass,
	});
	const isDemoPass = playbackPass === 'demo';
	const isStudentPass = playbackPass === 'student';

	const stop = useCallback(() => {
		setActiveSource(null);
		setPlaybackPass(null);
		setCountInBeat(null);
	}, []);

	const toggleMetronome = useCallback(() => {
		setActiveSource((source) => (source === null ? 'metronome' : null));
	}, []);

	const toggleMeasures = useCallback(() => {
		setActiveSource((source) => {
			if (source !== null) {
				return null;
			}
			// Enter count-in immediately so the first cell never lights before the pass starts.
			if (countInEnabledRef.current) {
				setIsCountingIn(true);
				setCountInBeat(null);
				setPlaybackPass(null);
			}
			return 'measures';
		});
	}, []);

	const startMetronome = useCallback(() => {
		setActiveSource('metronome');
	}, []);

	const handleTempoChange = useCallback(
		(updated: number) => {
			stop();
			setTempo(clampTempo(updated));
		},
		[stop, setTempo],
	);

	useEffect(() => {
		return () => {
			audioEngineRef.current.closeIfOpen();
		};
	}, []);

	useEffect(() => {
		if (!isRunning || activeSource === null) {
			setIsCountingIn(false);
			setCountInBeat(null);
			setPlaybackPass(null);
			setSubdivisionIndex(0);
			setMeasureCycle(0);
			return;
		}

		let cancelled = false;
		let held = false;
		let sessionScheduler: LookaheadScheduler | null = null;
		const scheduledUiTimeoutIds: ReturnType<typeof setTimeout>[] = [];
		const engine = audioEngineRef.current;

		const flash = () => {
			setIsLit(true);
			setTimeout(() => setIsLit(false), BEAT_FLASH_MS);
		};

		const scheduleUi = (audioTime: number, fn: () => void) => {
			const delayMs = Math.max(
				0,
				(audioTime - engine.getContext().currentTime) * 1000,
			);
			scheduledUiTimeoutIds.push(
				setTimeout(() => {
					if (cancelled) return;
					fn();
				}, delayMs),
			);
		};

		const clearPlaybackTimers = () => {
			sessionScheduler?.stop();
			sessionScheduler = null;
			while (scheduledUiTimeoutIds.length > 0) {
				const id = scheduledUiTimeoutIds.pop();
				if (id !== undefined) clearTimeout(id);
			}
		};

		const clearTimers = () => {
			clearPlaybackTimers();
			engine.cancelScheduled();
		};

		const resumeAfterBar = () => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (cancelled) return;
					held = false;
					sessionScheduler?.nudge();
				});
			});
		};

		const dispatch = (
			event: PlaybackClockEvent,
			currentPass: { value: PlaybackPass },
			playbackUi: { started: boolean },
		): boolean => {
			if (event.phase === 'count-in') {
				if (!muteMetronomeRef.current) {
					engine.scheduleClick(event.audioTime);
				}
				scheduleUi(event.audioTime, () => {
					setCountInBeat(event.index + 1);
					flash();
				});
				return false;
			}

			const passForEvent = currentPass.value;
			const step = event.index;

			if (activeSourceRef.current === 'measures') {
				const measure = measureForPlaybackPass(
					passForEvent,
					previewMeasureRef.current,
					playbackMeasureRef.current,
				);
				if (measure && stepHasHit(measure, subdivisionLevel, step)) {
					const s = settingsRef.current;
					if (
						shouldPlayRhythmAudio(
							passForEvent,
							s.muteOnStudentPass,
							muteRhythmSoundsRef.current,
						)
					) {
						engine.scheduleHit(event.audioTime);
					}
				}
			}

			if (event.isDownbeat && !muteMetronomeRef.current) {
				engine.scheduleClick(event.audioTime);
			}

			let passAfterBar = currentPass.value;
			let bumpCycle = false;
			if (event.isLastStepInBar) {
				const next = nextPassAfterBar(
					currentPass.value,
					settingsRef.current.demoBeforePlay,
				);
				passAfterBar = next.pass;
				bumpCycle = next.bumpCycle;
				currentPass.value = next.pass;
			}

			scheduleUi(event.audioTime, () => {
				if (!playbackUi.started) {
					playbackUi.started = true;
					setIsCountingIn(false);
					setCountInBeat(null);
					setPlaybackPass(passForEvent);
				}
				setSubdivisionIndex(step);
				if (event.isDownbeat) flash();
				if (event.isLastStepInBar) {
					setPlaybackPass(passAfterBar);
					if (bumpCycle) {
						setMeasureCycle((cycle) => cycle + 1);
					}
					resumeAfterBar();
				}
			});

			return shouldHoldLookaheadAfterEvent(event, bumpCycle);
		};

		const begin = () => {
			if (cancelled) return;

			const withCountIn = shouldRunCountIn(
				activeSource,
				countInEnabledRef.current,
			);

			if (withCountIn) {
				setIsCountingIn(true);
				setCountInBeat(null);
				setPlaybackPass(null);
			} else {
				setIsCountingIn(false);
				setCountInBeat(null);
			}

			setSubdivisionIndex(0);
			setMeasureCycle(0);

			const context = engine.getContext();
			const clock = createPlaybackClock({
				tempo,
				subdivisionLevel,
				countInEnabled: withCountIn,
				audioNow: context.currentTime,
			});
			const currentPass = {
				value:
					activeSource === 'measures'
						? initialPlaybackPass(settingsRef.current.demoBeforePlay)
						: ('student' satisfies PlaybackPass),
			};
			const playbackUi = { started: false };

			sessionScheduler = createLookaheadScheduler({
				getAudioTime: () => engine.getContext().currentTime,
				peekNextTime: () =>
					held ? Number.POSITIVE_INFINITY : clock.peek().audioTime,
				onDue: () => {
					const event = clock.advance();
					if (dispatch(event, currentPass, playbackUi)) {
						held = true;
						return 'pause';
					}
					return undefined;
				},
			});
			sessionScheduler.start();
		};

		const context = engine.getContext();
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
			if (isEditableTarget(e.target)) return;

			if (e.key === ' ' || e.key === 'Enter') {
				setActiveSource((source) => {
					if (source !== null) {
						return null;
					}
					if (countInEnabledRef.current) {
						setIsCountingIn(true);
						setCountInBeat(null);
						setPlaybackPass(null);
					}
					return 'measures';
				});
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
		return () => window.removeEventListener('keyup', handleKeyUp);
	}, [tempo, handleTempoChange, stop]);

	const value: MetronomeContextValue = {
		tempo,
		activeSource,
		isRunning,
		isMetronomeRunning,
		isMeasuresRunning,
		isCountingIn,
		countInBeat,
		isMeasuresPlaying,
		isDemoPass,
		isStudentPass,
		playbackPass,
		isLit,
		subdivisionIndex,
		measureCycle,
		setPlaybackMeasure,
		setPreviewMeasure,
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
