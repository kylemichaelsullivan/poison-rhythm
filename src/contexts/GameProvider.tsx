import type { MutableRefObject, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameContext } from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useSettings } from '@/contexts/SettingsContext';
import {
	createRoundForMode,
	onMeasureCompleteForMode,
	type VisualHint,
} from '@/lib/game-modes';
import { isEndlessMode } from '@/lib/settings-schema';
import type { RhythmMeasure, Round } from '@/types';
import { richToRhythmMeasure } from '@/types';

type RhythmModule = typeof import('@/lib/rhythm');

function preloadRhythm(rhythmRef: MutableRefObject<RhythmModule | null>) {
	void import('@/lib/rhythm').then((module) => {
		rhythmRef.current = module;
	});
}

export function GameProvider({ children }: { children: ReactNode }) {
	const { difficulty, subdivisionLevel } = usePreferences();
	const { settings } = useSettings();
	// Sync seed from storage-hydrated settings so first paint already has a round
	// (avoids empty prompt → MIDI roll flash from async init).
	const [round, setRound] = useState<Round | null>(() =>
		createRoundForMode({
			difficulty,
			subdivisionLevel,
			settings,
			roundNumber: 1,
		}),
	);
	const [currentIndex, setCurrentIndexState] = useState(0);
	const [roundNumber, setRoundNumber] = useState(1);
	const [visualHints, setVisualHints] = useState<VisualHint[]>([]);
	const rhythmRef = useRef<RhythmModule | null>(null);

	useEffect(() => {
		let cancelled = false;

		const run = () => {
			if (!cancelled) {
				preloadRhythm(rhythmRef);
			}
		};

		if ('requestIdleCallback' in globalThis) {
			const id = requestIdleCallback(run);
			return () => {
				cancelled = true;
				cancelIdleCallback(id);
			};
		}

		const id = setTimeout(run, 1);
		return () => {
			cancelled = true;
			clearTimeout(id);
		};
	}, []);

	const measures: RhythmMeasure[] = useMemo(
		() => (round ? round.measures.map(richToRhythmMeasure) : []),
		[round],
	);

	const poisonRhythm: RhythmMeasure | null = useMemo(
		() => (round ? richToRhythmMeasure(round.poisonMeasure) : null),
		[round],
	);

	const handleNewRound = useCallback(
		(overrides?: { difficulty?: number }) => {
			const nextRoundNumber = roundNumber + 1;
			const newRound = createRoundForMode({
				difficulty: overrides?.difficulty ?? difficulty,
				subdivisionLevel,
				settings,
				roundNumber: nextRoundNumber,
			});
			setRound(newRound);
			setCurrentIndexState(0);
			setRoundNumber(nextRoundNumber);
			setVisualHints([]);
		},
		[difficulty, subdivisionLevel, settings, roundNumber],
	);

	const handleReuseRound = useCallback(() => {
		if (!round) return;
		const newRound = createRoundForMode({
			difficulty,
			subdivisionLevel,
			settings,
			roundNumber,
		});
		setRound({
			...newRound,
			poisonMeasure: round.poisonMeasure,
			seed: round.seed,
		});
		setCurrentIndexState(0);
		setVisualHints([]);
	}, [difficulty, subdivisionLevel, settings, round, roundNumber]);

	const setCurrentIndex = useCallback(
		(index: number) => {
			setCurrentIndexState(index);

			if (!round || !isEndlessMode(settings)) return;

			const remaining = round.measures.length - index - 1;
			if (remaining > settings.endlessPrefetchRemaining) return;

			void (async () => {
				const rhythm = rhythmRef.current ?? (await import('@/lib/rhythm'));
				rhythmRef.current = rhythm;
				const appendBatch = rhythm.generateAppendBatch(
					{ difficulty, subdivisionLevel, settings, seed: round.seed },
					round.measures,
					round.poisonMeasure,
					round.seed,
					settings.endlessAppendBatch,
				);

				if (appendBatch.length === 0) return;

				setRound((prev) => {
					if (!prev) return prev;
					return { ...prev, measures: [...prev.measures, ...appendBatch] };
				});
			})();
		},
		[round, difficulty, subdivisionLevel, settings],
	);

	const onMeasureComplete = useCallback(
		(measureIndex: number): boolean => {
			if (!round) return true;

			const result = onMeasureCompleteForMode(
				{ difficulty, subdivisionLevel, settings, roundNumber },
				round,
				measureIndex,
			);
			setVisualHints(result.visualHints);
			return result.shouldStop;
		},
		[round, difficulty, subdivisionLevel, settings, roundNumber],
	);

	const value = useMemo(
		() => ({
			round,
			measures,
			richMeasures: round?.measures ?? [],
			poisonRhythm,
			poisonMeasure: round?.poisonMeasure ?? null,
			poisonIndex: round?.poisonIndex ?? -1,
			currentIndex,
			roundNumber,
			visualHints,
			setCurrentIndex,
			handleNewRound,
			handleReuseRound,
			onMeasureComplete,
		}),
		[
			round,
			measures,
			poisonRhythm,
			currentIndex,
			roundNumber,
			visualHints,
			setCurrentIndex,
			handleNewRound,
			handleReuseRound,
			onMeasureComplete,
		],
	);

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
