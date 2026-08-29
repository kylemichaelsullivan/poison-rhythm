import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type { GameSettings } from '@/lib/settings-schema';
import { isEndlessMode } from '@/lib/settings-schema';
import type { RichRhythmMeasure, Round } from '@/types';
import { richMeasuresEqual } from '@/types';
import { generateMeasure } from './generate-measure';
import { shouldInjectPoison } from './poison';
import { createPRNG, randomSeed } from './prng';

export type GenerateRoundOptions = {
	difficulty: number;
	subdivisionLevel: SubdivisionLevel;
	settings: GameSettings;
	seed?: number;
};

function cloneMeasure(measure: RichRhythmMeasure): RichRhythmMeasure {
	return measure.map((s) => ({ ...s }));
}

function generateMeasureDifferentFrom(
	options: GenerateRoundOptions,
	seed: number,
	exclude: RichRhythmMeasure,
): RichRhythmMeasure {
	return generateMeasure({
		difficulty: options.difficulty,
		subdivisionLevel: options.subdivisionLevel,
		settings: options.settings,
		seed,
		exclude,
	});
}

/** Decoy that is not the poison pattern and preferably differs from `exclude`. */
function generateDecoy(
	options: GenerateRoundOptions,
	seed: number,
	poisonMeasure: RichRhythmMeasure,
	exclude: RichRhythmMeasure,
): RichRhythmMeasure {
	let measure = generateMeasureDifferentFrom(options, seed, exclude);
	for (
		let attempt = 0;
		attempt < 20 && richMeasuresEqual(measure, poisonMeasure);
		attempt += 1
	) {
		measure = generateMeasureDifferentFrom(
			options,
			seed + 500 + attempt,
			poisonMeasure,
		);
	}
	return measure;
}

/** Decoy-only batch when poison is disabled (avoids waiting forever for injection). */
const POISON_OFF_DEFAULT_BATCH = 8;

function computeDefaultBatch(
	options: GenerateRoundOptions,
	poisonMeasure: RichRhythmMeasure,
	seed: number,
): { measures: RichRhythmMeasure[]; poisonIndex: number } {
	const { settings } = options;
	const measures: RichRhythmMeasure[] = [];
	let poisonIndex = -1;
	const rng = createPRNG(seed);

	if (settings.poisonMode === 'off') {
		for (let index = 0; index < POISON_OFF_DEFAULT_BATCH; index += 1) {
			const exclude =
				index === 0 ? poisonMeasure : measures[measures.length - 1];
			measures.push(
				generateDecoy(options, seed + index, poisonMeasure, exclude),
			);
		}
		return { measures, poisonIndex: -1 };
	}

	let index = 0;
	while (poisonIndex < 0) {
		if (index === 0) {
			measures.push(
				generateDecoy(options, seed + index, poisonMeasure, poisonMeasure),
			);
		} else if (
			shouldInjectPoison(settings.poisonMode, index, rng, options.difficulty)
		) {
			measures.push(cloneMeasure(poisonMeasure));
			poisonIndex = measures.length - 1;
			measures.push(
				generateDecoy(
					options,
					seed + index + 1000,
					poisonMeasure,
					poisonMeasure,
				),
			);
		} else {
			const last = measures[measures.length - 1];
			measures.push(generateDecoy(options, seed + index, poisonMeasure, last));
		}
		index += 1;
	}

	return { measures, poisonIndex };
}

function computeEndlessBatch(
	options: GenerateRoundOptions,
	poisonMeasure: RichRhythmMeasure,
	seed: number,
	count: number,
): { measures: RichRhythmMeasure[]; poisonIndex: number } {
	const { settings } = options;
	const measures: RichRhythmMeasure[] = [];
	let poisonIndex = -1;
	const rng = createPRNG(seed);
	let previousWasPoison = false;

	for (let i = 0; i < count; i += 1) {
		const inject =
			!previousWasPoison &&
			shouldInjectPoison(settings.poisonMode, i, rng, options.difficulty, {
				stationary: true,
			});
		if (inject) {
			measures.push(cloneMeasure(poisonMeasure));
			if (poisonIndex < 0) poisonIndex = measures.length - 1;
			// Always leave a following measure so Next preview is never empty.
			measures.push(
				generateDecoy(options, seed + i + 1000, poisonMeasure, poisonMeasure),
			);
			previousWasPoison = false;
		} else {
			const exclude = i === 0 ? poisonMeasure : measures[measures.length - 1];
			measures.push(generateDecoy(options, seed + i, poisonMeasure, exclude));
			previousWasPoison = false;
		}
	}

	return { measures, poisonIndex };
}

export function generateRound(options: GenerateRoundOptions): Round {
	const seed = options.seed ?? randomSeed();
	const { settings } = options;

	const poisonMeasure = generateMeasure({
		difficulty: options.difficulty,
		subdivisionLevel: options.subdivisionLevel,
		settings: options.settings,
		seed: seed + 777,
	});

	if (isEndlessMode(settings)) {
		const { measures, poisonIndex } = computeEndlessBatch(
			options,
			poisonMeasure,
			seed,
			settings.endlessInitialBatch,
		);
		return {
			measures,
			poisonIndex,
			seed,
			poisonMeasure,
		};
	}

	const { measures, poisonIndex } = computeDefaultBatch(
		options,
		poisonMeasure,
		seed,
	);

	return {
		measures,
		poisonIndex,
		seed,
		poisonMeasure,
	};
}

export function generateAppendBatch(
	options: GenerateRoundOptions,
	existing: RichRhythmMeasure[],
	poisonMeasure: RichRhythmMeasure,
	seed: number,
	count: number,
): RichRhythmMeasure[] {
	const { settings } = options;
	const startSeed = seed + existing.length * 31;
	const batch: RichRhythmMeasure[] = [];
	let prev = existing[existing.length - 1];
	const rng = createPRNG(startSeed + 999);

	let previousWasPoison = richMeasuresEqual(prev, poisonMeasure);

	for (let i = 0; i < count; i += 1) {
		const measureIndex = existing.length + i;
		const inject =
			!previousWasPoison &&
			shouldInjectPoison(
				settings.poisonMode,
				measureIndex,
				rng,
				options.difficulty,
				{ stationary: true },
			);
		if (inject) {
			const poison = cloneMeasure(poisonMeasure);
			batch.push(poison);
			const decoy = generateDecoy(
				options,
				startSeed + i + 1000,
				poisonMeasure,
				poisonMeasure,
			);
			batch.push(decoy);
			prev = decoy;
			previousWasPoison = false;
		} else {
			const decoy = generateDecoy(options, startSeed + i, poisonMeasure, prev);
			batch.push(decoy);
			prev = decoy;
			previousWasPoison = false;
		}
	}

	return batch;
}
