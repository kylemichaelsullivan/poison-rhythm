import { useCallback, useState } from 'react';
import { usePreferences } from '@/contexts';
import { useSettings } from '@/contexts/SettingsContext';
import { generateAppendBatch, generateRound } from '@/lib/rhythm';
import { isEndlessMode } from '@/lib/settings-schema';
import type { RhythmMeasure, RichRhythmMeasure, Round } from '@/types';
import { richToRhythmMeasure } from '@/types';

export function useGameLoop() {
	const { difficulty, subdivisionLevel } = usePreferences();
	const { settings } = useSettings();
	const [round, setRound] = useState<Round | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const measures: RhythmMeasure[] = round
		? round.measures.map(richToRhythmMeasure)
		: [];

	const poisonRhythm: RhythmMeasure | null = round
		? richToRhythmMeasure(round.poisonMeasure)
		: null;

	const handleNewRound = useCallback(() => {
		const newRound = generateRound({ difficulty, subdivisionLevel, settings });
		setRound(newRound);
		setCurrentIndex(0);
	}, [difficulty, subdivisionLevel, settings]);

	const handleReuseRound = useCallback(() => {
		if (!round) return;
		const newRound = generateRound({
			difficulty,
			subdivisionLevel,
			settings,
			seed: round.seed,
		});
		setRound(newRound);
		setCurrentIndex(0);
	}, [difficulty, subdivisionLevel, settings, round]);

	const handleIndexChange = useCallback(
		(index: number) => {
			setCurrentIndex(index);

			if (!round || !isEndlessMode(settings)) return;

			const remaining = round.measures.length - index - 1;
			if (remaining > settings.endlessPrefetchRemaining) return;

			const appendBatch = generateAppendBatch(
				{ difficulty, subdivisionLevel, settings, seed: round.seed },
				round.measures,
				round.poisonMeasure,
				round.seed,
				settings.endlessAppendBatch,
			);

			if (appendBatch.length === 0) return;

			setRound((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					measures: [...prev.measures, ...appendBatch],
				};
			});
		},
		[round, difficulty, subdivisionLevel, settings],
	);

	const richMeasures: RichRhythmMeasure[] = round?.measures ?? [];

	return {
		round,
		measures,
		richMeasures,
		poisonRhythm,
		poisonMeasure: round?.poisonMeasure ?? null,
		poisonIndex: round?.poisonIndex ?? -1,
		currentIndex,
		setCurrentIndex: handleIndexChange,
		handleNewRound,
		handleReuseRound,
		handleNewPoison: handleNewRound,
		handleReusePoison: handleReuseRound,
	};
}
