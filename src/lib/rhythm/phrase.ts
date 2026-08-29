import type { PhraseLength } from '@/lib/settings-schema';
import type { RichRhythmMeasure } from '@/types';
import type { GenerateMeasureOptions } from './generate-measure';
export function assemblePhrase(
	generateOne: (opts: GenerateMeasureOptions) => RichRhythmMeasure,
	options: GenerateMeasureOptions,
	phraseLength: PhraseLength,
): RichRhythmMeasure[] {
	const measures: RichRhythmMeasure[] = [];
	let lastMeasure: RichRhythmMeasure | null = null;

	for (let i = 0; i < phraseLength; i += 1) {
		const exclude = lastMeasure ?? options.exclude ?? null;
		const measure = generateOne({
			...options,
			seed: options.seed + i * 997,
			exclude,
		});
		measures.push(measure);
		lastMeasure = measure;
	}

	return measures;
}
