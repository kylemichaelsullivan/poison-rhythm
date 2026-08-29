import type { StickingMode } from '@/lib/settings-schema';
import type { RichRhythmMeasure, StickingHand } from '@/types';
import type { PRNG } from './prng';

export function applySticking(
	measure: RichRhythmMeasure,
	mode: StickingMode,
	rng: PRNG,
): RichRhythmMeasure {
	if (mode === 'off') return measure;

	let hand: StickingHand = 'R';
	const hitIndices = measure.filter((s) => s.hit).map((s) => s.index);

	for (const idx of hitIndices) {
		switch (mode) {
			case 'alternating':
				measure[idx].sticking = hand;
				hand = hand === 'R' ? 'L' : 'R';
				break;
			case 'dominant':
				measure[idx].sticking = 'R';
				break;
			case 'random':
				measure[idx].sticking = rng.next() < 0.5 ? 'R' : 'L';
				break;
		}
	}

	return measure;
}
