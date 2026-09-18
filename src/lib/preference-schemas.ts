import { z } from 'zod';
import { CRAYON_IDS, type CrayonId, isCrayonId } from './colors/crayola-64';
import { DIFFICULTY_MAX, DIFFICULTY_MIN } from './difficulty-levels';
import { BPM_DEFAULT, BPM_MAX, BPM_MIN } from './metronome-defaults';
import type { ThemePreference } from './theme-options';

export const storedThemeSchema = z.enum(['light', 'dark']);

/** null = follow system preference */
export type ThemeSetting = ThemePreference;

export const subdivisionLevelSchema = z.enum([
	'quarters',
	'eighths',
	'sixteenths',
]);
export type SubdivisionLevel = z.infer<typeof subdivisionLevelSchema>;

export const DEFAULT_SUBDIVISION_LEVEL: SubdivisionLevel = 'eighths';

export const difficultySchema = z
	.number()
	.int()
	.min(DIFFICULTY_MIN)
	.max(DIFFICULTY_MAX);

export const DEFAULT_DIFFICULTY = 2;

export const tempoSchema = z
	.number()
	.min(BPM_MIN)
	.max(BPM_MAX)
	.transform((value) => Math.round(value));

export { BPM_DEFAULT };

const explicitTrueSchema = z.literal('true');
const explicitFalseSchema = z.literal('false');

export function parseExplicitTrue(raw: string | null): boolean {
	return explicitTrueSchema.safeParse(raw).success;
}

export function parseThemeSetting(raw: string | null): ThemeSetting {
	if (raw === null) {
		return null;
	}

	const result = storedThemeSchema.safeParse(raw);
	return result.success ? result.data : null;
}

export function parseSubdivisionLevel(raw: string | null): SubdivisionLevel {
	if (raw === null) {
		return DEFAULT_SUBDIVISION_LEVEL;
	}

	const result = subdivisionLevelSchema.safeParse(raw);
	return result.success ? result.data : DEFAULT_SUBDIVISION_LEVEL;
}

export function parseDifficulty(raw: string | null): number {
	if (raw === null) {
		return DEFAULT_DIFFICULTY;
	}

	const parsed = Number.parseInt(raw, 10);
	const result = difficultySchema.safeParse(parsed);
	return result.success ? result.data : DEFAULT_DIFFICULTY;
}

export function parseTempo(raw: string | null): number | null {
	if (raw === null) {
		return null;
	}

	const parsed = Number.parseFloat(raw);
	const result = tempoSchema.safeParse(parsed);
	return result.success ? result.data : null;
}

export function parseCountInEnabled(raw: string | null): boolean | null {
	if (raw === null) {
		return null;
	}

	if (explicitFalseSchema.safeParse(raw).success) {
		return false;
	}

	if (explicitTrueSchema.safeParse(raw).success) {
		return true;
	}

	return null;
}

export function serializeThemeSetting(value: ThemeSetting): string | null {
	if (value === null) {
		return null;
	}

	return storedThemeSchema.parse(value);
}

export function serializeSubdivisionLevel(
	level: SubdivisionLevel,
): string | null {
	if (level === DEFAULT_SUBDIVISION_LEVEL) {
		return null;
	}

	return subdivisionLevelSchema.parse(level);
}

export function serializeDifficulty(value: number): string | null {
	const parsed = difficultySchema.parse(value);
	if (parsed === DEFAULT_DIFFICULTY) {
		return null;
	}

	return String(parsed);
}

export function serializeTempo(value: number): string | null {
	return String(tempoSchema.parse(value));
}

export function serializeExplicitTrue(enabled: boolean): string | null {
	return enabled ? 'true' : null;
}

export function serializeCountInEnabled(enabled: boolean): string | null {
	return enabled ? null : 'false';
}

/** null = Poison Rhythm brand accent (CSS @theme defaults). */
export type ColorPreference = CrayonId | null;

export const crayonIdSchema = z.enum(
	CRAYON_IDS as unknown as [CrayonId, ...CrayonId[]],
);

export function parseColorPreference(raw: string | null): ColorPreference {
	if (raw === null) {
		return null;
	}

	return isCrayonId(raw) ? raw : null;
}

export function serializeColorPreference(
	value: ColorPreference,
): string | null {
	if (value === null) {
		return null;
	}

	return crayonIdSchema.parse(value);
}
