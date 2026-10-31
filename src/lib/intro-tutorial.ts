import { MEASURE_LENGTH } from '@/types';
import type { RhythmMeasure } from '@/types';

/** Quarter-beat index 0–3 → cells 0, 4, 8, 12. */
export function quarterNoteMeasure(beats: readonly number[]): RhythmMeasure {
	const cells = Array.from({ length: MEASURE_LENGTH }, () => false);
	for (const beat of beats) {
		if (beat < 0 || beat > 3) {
			continue;
		}
		cells[beat * 4] = true;
	}
	return cells;
}

export const INTRO_POISON_BEATS = [0, 2] as const;

export const INTRO_SIMON_SAYS_PROMPT = 'Simon says: “Play this”';
export const INTRO_POISON_PROMPT = '“Play this”';
export const INTRO_POISON_FAIL_POISON = 'That’s the poison…';
export const INTRO_POISON_FAIL_LOSE = 'Play it, and you lose!';
/** Delay before each last-slide fail line. Lose appears after a second beat. */
export const INTRO_FAIL_REVEAL_MS = 1000;

export type IntroTutorialStepData = {
	id: string;
	prompt: string;
	/** Quarter-beat slots 0–3 for the current measure. */
	beats: readonly number[];
	isPoison: boolean;
};

/** Two safe Simon-says measures, then the poison with no Simon says. */
export const INTRO_TUTORIAL_STEPS: readonly IntroTutorialStepData[] = [
	{
		id: 'measure-1',
		prompt: INTRO_SIMON_SAYS_PROMPT,
		beats: [0],
		isPoison: false,
	},
	{
		id: 'measure-2',
		prompt: INTRO_SIMON_SAYS_PROMPT,
		beats: [0, 1, 2],
		isPoison: false,
	},
	{
		id: 'measure-3',
		prompt: INTRO_POISON_PROMPT,
		beats: INTRO_POISON_BEATS,
		isPoison: true,
	},
];
