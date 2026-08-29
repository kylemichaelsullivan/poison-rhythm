import type { ToggleSetting } from '@/lib/settings-schema';
import type { RichRhythmMeasure } from '@/types';
import { createEmptyRichMeasure } from '@/types';
import type { PRNG } from './prng';

export function applyAccentsAndRests(
	indices: number[],
	accents: ToggleSetting,
	rests: ToggleSetting,
	rng: PRNG,
): RichRhythmMeasure {
	const measure = createEmptyRichMeasure();

	if (rests === 'on' && indices.length > 1) {
		const filtered: number[] = [];
		let lastIndex = -2;
		for (const idx of indices.sort((a, b) => a - b)) {
			if (idx - lastIndex >= 2) {
				filtered.push(idx);
				lastIndex = idx;
			}
		}
		indices = filtered.length > 0 ? filtered : [indices[0]];
	}

	for (const idx of indices) {
		measure[idx].hit = true;
		if (accents === 'on' && idx % 4 === 0) {
			measure[idx].accent = true;
		} else if (accents === 'on' && rng.next() < 0.3) {
			measure[idx].accent = true;
		}
	}

	return measure;
}
