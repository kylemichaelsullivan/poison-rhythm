import { useEffect, useLayoutEffect, useRef } from 'react';
import { useGame, useMetronome, useSettings } from '@/contexts';
import {
	measureCompleteAction,
	rhythmsEqual,
	shouldProcessMeasureCycle,
} from '@/lib';
import type { ScrollDirection } from '@/lib/settings-schema';
import { isEndlessMode, isScrollDisplayMode } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure } from '@/types';

type UseMeasurePlaybackSyncResult = {
	safeIndex: number;
	measure: RhythmMeasure | undefined;
	nextMeasure: RhythmMeasure | null;
	displayMeasure: RhythmMeasure | null;
	displayRich: RichRhythmMeasure | undefined;
	nextDisplayMeasure: RhythmMeasure | null;
	nextDisplayRich: RichRhythmMeasure | undefined;
	showNextMeasure: boolean;
	demoBeforePlay: boolean;
	isDemoPass: boolean;
	isCountingIn: boolean;
	isMeasuresPlaying: boolean;
	isMeasuresRunning: boolean;
	measuresLength: number;
	setCurrentIndex: (index: number) => void;
	scrollMode: boolean;
	scrollDirection: Exclude<ScrollDirection, 'none'>;
};

export function useMeasurePlaybackSync(): UseMeasurePlaybackSyncResult {
	const {
		measures,
		poisonRhythm,
		currentIndex,
		setCurrentIndex,
		onMeasureComplete,
		richMeasures,
	} = useGame();
	const { settings } = useSettings();
	const stopOnPoisonMatch = !isEndlessMode(settings);
	const {
		isMeasuresRunning,
		isMeasuresPlaying,
		measureCycle,
		setPlaybackMeasure,
		stop,
		isDemoPass,
		isCountingIn,
	} = useMetronome();

	const lastProcessedCycleRef = useRef(0);
	const setCurrentIndexRef = useRef(setCurrentIndex);
	setCurrentIndexRef.current = setCurrentIndex;

	useEffect(() => {
		if (measures.length === 0) {
			setCurrentIndex(0);
		} else if (currentIndex >= measures.length) {
			setCurrentIndex(0);
		}
	}, [measures.length, currentIndex, setCurrentIndex]);

	useEffect(() => {
		if (!isMeasuresRunning) return;
		setCurrentIndexRef.current(0);
	}, [isMeasuresRunning]);

	useEffect(() => {
		if (
			!shouldProcessMeasureCycle(
				isMeasuresPlaying,
				measureCycle,
				lastProcessedCycleRef.current,
			)
		) {
			if (!isMeasuresPlaying) lastProcessedCycleRef.current = 0;
			return;
		}

		lastProcessedCycleRef.current = measureCycle;

		const completedMeasure = measures[currentIndex];
		const shouldStopGame = onMeasureComplete(currentIndex);
		const isPoisonMeasure =
			stopOnPoisonMatch &&
			Boolean(
				poisonRhythm &&
					completedMeasure &&
					rhythmsEqual(completedMeasure, poisonRhythm),
			);

		if (
			measureCompleteAction({
				currentIndex,
				measuresLength: measures.length,
				isPoisonMeasure,
				shouldStopGame,
			}) === 'stop'
		) {
			stop();
			return;
		}

		setCurrentIndex(currentIndex + 1);
	}, [
		measureCycle,
		isMeasuresPlaying,
		measures,
		poisonRhythm,
		stop,
		currentIndex,
		setCurrentIndex,
		onMeasureComplete,
		stopOnPoisonMatch,
	]);

	const safeIndex =
		measures.length > 0 ? Math.min(currentIndex, measures.length - 1) : 0;
	const measure = measures[safeIndex];
	const nextMeasure = measures[safeIndex + 1] ?? null;
	// Ref must be current before MetronomeProvider’s playback effect runs in the same commit.
	setPlaybackMeasure(measure ?? null);

	useLayoutEffect(() => {
		setPlaybackMeasure(measure ?? null);
	}, [measure, setPlaybackMeasure]);

	useEffect(() => {
		return () => setPlaybackMeasure(null);
	}, [setPlaybackMeasure]);

	const displayMeasure = measure ?? null;
	const displayRich = richMeasures[safeIndex];
	const nextDisplayMeasure = nextMeasure;
	const nextDisplayRich = richMeasures[safeIndex + 1];

	return {
		safeIndex,
		measure,
		nextMeasure,
		displayMeasure,
		displayRich,
		nextDisplayMeasure,
		nextDisplayRich,
		showNextMeasure: settings.showNextMeasure,
		demoBeforePlay: settings.demoBeforePlay,
		isDemoPass,
		isCountingIn,
		isMeasuresPlaying,
		isMeasuresRunning,
		measuresLength: measures.length,
		setCurrentIndex,
		scrollMode: isScrollDisplayMode(settings.rhythmRenderMode),
		scrollDirection:
			settings.scrollDirection === 'none' ? 'down' : settings.scrollDirection,
	};
}
