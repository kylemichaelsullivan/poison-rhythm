import { useCallback, useState } from 'react';
import { useDifficulty } from '@/contexts/DifficultyContext';
import { generateRandomMeasure } from '@/lib/rhythm-generator';
import { rhythmsEqual } from '@/lib/rhythm-utils';
import type { RhythmMeasure } from '@/types/rhythm';

function generateMeasureDifferentFrom(
	difficulty: number,
	exclude: RhythmMeasure,
): RhythmMeasure {
	let m: RhythmMeasure;
	do m = generateRandomMeasure(difficulty);
	while (rhythmsEqual(m, exclude));
	return m;
}

function poisonProbability(measureIndex: number): number {
	if (measureIndex <= 0) return 0;
	return 1 - 0.92 ** measureIndex;
}

function computeBatch(
	prev: RhythmMeasure[],
	poisonRhythm: RhythmMeasure,
	difficulty: number,
): { nextMeasures: RhythmMeasure[]; foundIndex: number | null } {
	const batch: RhythmMeasure[] = [];
	let foundIndex: number | null = null;
	let done = false;
	const lastExisting = prev.length > 0 ? prev[prev.length - 1] : null;

	while (!done) {
		const index = prev.length + batch.length;
		let m: RhythmMeasure;

		if (index === 0) {
			m = generateMeasureDifferentFrom(difficulty, poisonRhythm);
			batch.push(m);
		} else {
			if (Math.random() < poisonProbability(index)) {
				m = poisonRhythm;
				batch.push(m);
				foundIndex = batch.length - 1;
				batch.push(generateMeasureDifferentFrom(difficulty, m));
				done = true;
			} else {
				const last = batch.length > 0 ? batch[batch.length - 1] : lastExisting;
				if (!last) throw new Error('invariant: previous measure required');
				m = generateMeasureDifferentFrom(difficulty, last);
				while (rhythmsEqual(m, poisonRhythm)) {
					m = generateMeasureDifferentFrom(difficulty, poisonRhythm);
				}
				batch.push(m);
			}
		}
	}

	return {
		nextMeasures: [...prev, ...batch],
		foundIndex: foundIndex !== null ? prev.length + foundIndex : null,
	};
}

export function usePoisonGame() {
	const { difficulty } = useDifficulty();
	const [poisonRhythm, setPoisonRhythm] = useState<RhythmMeasure | null>(null);
	const [measures, setMeasures] = useState<RhythmMeasure[]>([]);
	const [poisonFoundAt, setPoisonFoundAt] = useState<number | null>(null);

	const handlePoisonChange = useCallback((poison: RhythmMeasure) => {
		setPoisonRhythm(poison);
		setMeasures([]);
		setPoisonFoundAt(null);
	}, []);

	const handleGenerate = useCallback(() => {
		if (poisonRhythm === null || poisonFoundAt !== null) return;
		setMeasures((prev) => {
			const { nextMeasures, foundIndex } = computeBatch(
				prev,
				poisonRhythm,
				difficulty,
			);
			if (foundIndex !== null) {
				setPoisonFoundAt(foundIndex);
			}
			return nextMeasures;
		});
	}, [difficulty, poisonRhythm, poisonFoundAt]);

	const handleNewPoison = useCallback(() => {
		const newPoison = generateRandomMeasure(difficulty);
		setPoisonRhythm(newPoison);
		setPoisonFoundAt(null);
		setMeasures(() => {
			const { nextMeasures, foundIndex } = computeBatch(
				[],
				newPoison,
				difficulty,
			);
			if (foundIndex !== null) {
				setPoisonFoundAt(foundIndex);
			}
			return nextMeasures;
		});
	}, [difficulty]);

	const handleReusePoison = useCallback(() => {
		if (poisonRhythm === null) return;
		setPoisonFoundAt(null);
		setMeasures(() => {
			const { nextMeasures, foundIndex } = computeBatch(
				[],
				poisonRhythm,
				difficulty,
			);
			if (foundIndex !== null) {
				setPoisonFoundAt(foundIndex);
			}
			return nextMeasures;
		});
	}, [difficulty, poisonRhythm]);

	return {
		poisonRhythm,
		measures,
		poisonFoundAt,
		handlePoisonChange,
		handleGenerate,
		handleNewPoison,
		handleReusePoison,
	};
}
