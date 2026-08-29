import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { GameSettings } from '@/lib/settings-schema';
import type { RichRhythmMeasure } from '@/types';
import { richMeasuresEqual } from '@/types';
import { applyAccentsAndRests } from './accents-rests';
import { computeHitCount } from './density';
import { allowedIndicesForSubdivisionLevel } from './grid';
import { createPRNG } from './prng';
import { applySticking } from './sticking';
import { pickHitIndices } from './syncopation';

/** Cap exclude retries — tiny grids (e.g. quarters) can collapse to one pattern. */
const MAX_EXCLUDE_ATTEMPTS = 32;

export type GenerateMeasureOptions = {
	difficulty: number;
	subdivisionLevel: SubdivisionLevel;
	settings: GameSettings;
	seed: number;
	exclude?: RichRhythmMeasure | null;
};

function buildMeasure(
	options: GenerateMeasureOptions,
	seed: number,
): RichRhythmMeasure {
	const { difficulty, subdivisionLevel, settings } = options;
	const rng = createPRNG(seed);

	const allowed = allowedIndicesForSubdivisionLevel(subdivisionLevel);
	const hits = computeHitCount(difficulty, rng, allowed.length);
	const indices = pickHitIndices(allowed, hits, difficulty, rng);

	const measure = applyAccentsAndRests(
		indices,
		settings.accents,
		settings.rests,
		rng,
	);
	return applySticking(measure, settings.sticking, rng);
}

export function generateMeasure(
	options: GenerateMeasureOptions,
): RichRhythmMeasure {
	const { seed, exclude } = options;
	let measure = buildMeasure(options, seed);

	if (!exclude) return measure;

	for (let attempt = 1; attempt < MAX_EXCLUDE_ATTEMPTS; attempt += 1) {
		if (!richMeasuresEqual(measure, exclude)) return measure;
		measure = buildMeasure(options, seed + attempt);
	}

	return measure;
}
