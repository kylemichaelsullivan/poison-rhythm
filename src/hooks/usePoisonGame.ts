import { useCallback, useState } from 'react';
import { useDifficulty } from '@/contexts';
import { generateRandomMeasure, rhythmsEqual } from '@/lib';
import type { RhythmMeasure } from '@/types';

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
): RhythmMeasure[] {
	const batch: RhythmMeasure[] = [];
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

	return [...prev, ...batch];
}

export function usePoisonGame() {
	const { difficulty } = useDifficulty();
	const [poisonRhythm, setPoisonRhythm] = useState<RhythmMeasure | null>(null);
	const [measures, setMeasures] = useState<RhythmMeasure[]>([]);

	const handleNewPoison = useCallback(() => {
		const newPoison = generateRandomMeasure(difficulty);
		setPoisonRhythm(newPoison);
		setMeasures(computeBatch([], newPoison, difficulty));
	}, [difficulty]);

	const handleReusePoison = useCallback(() => {
		if (poisonRhythm === null) return;
		setMeasures(computeBatch([], poisonRhythm, difficulty));
	}, [difficulty, poisonRhythm]);

	return {
		poisonRhythm,
		measures,
		handleNewPoison,
		handleReusePoison,
	};
}
