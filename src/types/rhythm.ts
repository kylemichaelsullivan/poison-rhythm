export const MEASURE_LENGTH = 16;

/** Legacy boolean grid: true = hit, false = rest. */
export type LegacyRhythmMeasure = boolean[];

/** @deprecated Use RhythmMeasure (RhythmStep[]) for new code. */
export type RhythmMeasure = LegacyRhythmMeasure;

export type StickingHand = 'L' | 'R';

export type RhythmStep = {
	index: number;
	hit: boolean;
	accent?: boolean;
	sticking?: StickingHand;
};

export type RichRhythmMeasure = RhythmStep[];

export type PoisonMeta = {
	isPoison: boolean;
	visible: boolean;
	persistent: boolean;
};

export type Round = {
	measures: RichRhythmMeasure[];
	poisonIndex: number;
	seed: number;
	poisonMeasure: RichRhythmMeasure;
};

export type GameState = {
	round: Round | null;
	currentIndex: number;
	activeGameMode: import('@/lib/settings-schema').GameMode;
};

/** All rests; used for layout spacers and placeholders. */
export const REST_MEASURE: LegacyRhythmMeasure = Array.from(
	{ length: MEASURE_LENGTH },
	() => false,
);

export function createEmptyRichMeasure(): RichRhythmMeasure {
	return Array.from({ length: MEASURE_LENGTH }, (_, index) => ({
		index,
		hit: false,
	}));
}

export function legacyToRichMeasure(
	measure: LegacyRhythmMeasure,
): RichRhythmMeasure {
	return measure.map((hit, index) => ({ index, hit }));
}

export function richToLegacyMeasure(
	measure: RichRhythmMeasure,
): LegacyRhythmMeasure {
	return measure.map((step) => step.hit);
}

export function richMeasuresEqual(
	a: RichRhythmMeasure,
	b: RichRhythmMeasure,
): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i += 1) {
		if (a[i].hit !== b[i].hit) return false;
	}
	return true;
}
