import { z } from 'zod';

export const playersSchema = z.union([z.literal(1), z.literal(2)]);
export type Players = z.infer<typeof playersSchema>;

export const feedbackModeSchema = z.enum(['none', 'visual', 'audio', 'both']);
export type FeedbackMode = z.infer<typeof feedbackModeSchema>;

export function feedbackModeFromToggles(
	visual: boolean,
	audio: boolean,
): FeedbackMode {
	if (visual && audio) return 'both';
	if (visual) return 'visual';
	if (audio) return 'audio';
	return 'none';
}

export function feedbackTogglesFromMode(mode: FeedbackMode): {
	visual: boolean;
	audio: boolean;
} {
	return {
		visual: mode === 'visual' || mode === 'both',
		audio: mode === 'audio' || mode === 'both',
	};
}

export const scrollDirectionSchema = z.enum([
	'none',
	'left',
	'right',
	'up',
	'down',
]);
export type ScrollDirection = z.infer<typeof scrollDirectionSchema>;

export const scrollSpeedSchema = z.enum(['slow', 'medium', 'fast']);
export type ScrollSpeed = z.infer<typeof scrollSpeedSchema>;

export const toggleSchema = z.enum(['on', 'off']);
export type ToggleSetting = z.infer<typeof toggleSchema>;

export const phraseLengthSchema = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(4),
]);
export type PhraseLength = z.infer<typeof phraseLengthSchema>;

export const stickingModeSchema = z.enum([
	'off',
	'alternating',
	'dominant',
	'random',
]);
export type StickingMode = z.infer<typeof stickingModeSchema>;

export const poisonModeSchema = z.enum(['off', 'visible', 'hidden']);
export type PoisonMode = z.infer<typeof poisonModeSchema>;

export const gameModeSchema = z.enum(['default', 'bucketTrainer']);
export type GameMode = z.infer<typeof gameModeSchema>;

/** Legacy gameMode values persisted before renames / Endless-as-toggle. */
const LEGACY_GAME_MODE_MAP: Record<string, GameMode> = {
	memory: 'default',
	mirror: 'default',
	fixTheRhythm: 'default',
	endless: 'default',
	poisonGauntlet: 'default',
};

/** Former Memory play mode → Classic + hide poison during playback. */
const MEMORY_LIKE_GAME_MODES = new Set(['memory', 'mirror']);

export const rhythmRenderModeSchema = z.enum(['grid', 'notation', 'scroll']);
export type RhythmRenderMode = z.infer<typeof rhythmRenderModeSchema>;

export function isScrollDisplayMode(mode: RhythmRenderMode): boolean {
	return mode === 'scroll';
}

export const gameSettingsSchema = z.object({
	players: playersSchema,
	feedbackMode: feedbackModeSchema,
	scrollDirection: scrollDirectionSchema,
	scrollSpeed: scrollSpeedSchema,
	accents: toggleSchema,
	rests: toggleSchema,
	phraseLength: phraseLengthSchema,
	sticking: stickingModeSchema,
	poisonMode: poisonModeSchema,
	gameMode: gameModeSchema,
	rhythmRenderMode: rhythmRenderModeSchema,
	showNextMeasure: z.boolean(),
	demoBeforePlay: z.boolean(),
	muteOnStudentPass: z.boolean(),
	endless: z.boolean(),
	endlessInitialBatch: z.number().int().min(1).max(64),
	endlessAppendBatch: z.number().int().min(1).max(64),
	endlessPrefetchRemaining: z.number().int().min(0).max(32),
});

export type GameSettings = z.infer<typeof gameSettingsSchema>;

export const DEFAULT_SETTINGS: GameSettings = {
	players: 1,
	feedbackMode: 'both',
	scrollDirection: 'none',
	scrollSpeed: 'medium',
	accents: 'off',
	rests: 'off',
	phraseLength: 1,
	sticking: 'off',
	poisonMode: 'visible',
	gameMode: 'default',
	rhythmRenderMode: 'grid',
	showNextMeasure: false,
	demoBeforePlay: false,
	muteOnStudentPass: false,
	endless: false,
	endlessInitialBatch: 8,
	endlessAppendBatch: 8,
	endlessPrefetchRemaining: 3,
};

function migrateRawGameSettings(value: unknown): unknown {
	if (!value || typeof value !== 'object') {
		return value;
	}

	const record = { ...(value as Record<string, unknown>) };
	if (typeof record.gameMode === 'string') {
		if (record.gameMode === 'endless') {
			record.gameMode = 'default';
			record.endless = true;
		} else {
			const wasMemoryLike = MEMORY_LIKE_GAME_MODES.has(record.gameMode);
			const mapped = LEGACY_GAME_MODE_MAP[record.gameMode];
			if (mapped) {
				record.gameMode = mapped;
			}
			if (wasMemoryLike && record.poisonMode !== 'off') {
				record.poisonMode = 'hidden';
			}
		}
	}
	if (record.poisonMode === 'persistent') {
		record.poisonMode = 'visible';
	}
	// Orthogonal scroll overlay → exclusive Scroll display mode.
	if (
		record.rhythmRenderMode !== 'scroll' &&
		typeof record.scrollDirection === 'string' &&
		record.scrollDirection !== 'none'
	) {
		record.rhythmRenderMode = 'scroll';
	}
	// Scroll mode always needs a concrete highway direction.
	if (
		record.rhythmRenderMode === 'scroll' &&
		(record.scrollDirection === undefined || record.scrollDirection === 'none')
	) {
		record.scrollDirection = 'down';
	}
	// Focus modes / poison frequency removed; strip so stored values don’t fail.
	delete record.focusMode;
	delete record.poisonFrequency;
	return record;
}

export function sanitizeGameSettings(
	partial: Partial<GameSettings>,
): GameSettings {
	const migrated = migrateRawGameSettings(partial) as Partial<GameSettings>;
	const merged = { ...DEFAULT_SETTINGS, ...migrated };
	if (!merged.demoBeforePlay) {
		merged.muteOnStudentPass = false;
	}
	// Phrase length is unused; keep schema key but always generate single measures.
	merged.phraseLength = 1;
	// Rests toggle is unused; density already leaves gaps.
	merged.rests = 'off';
	if (merged.rhythmRenderMode === 'scroll') {
		if (merged.scrollDirection === 'none') {
			merged.scrollDirection = 'down';
		}
	} else {
		merged.scrollDirection = 'none';
	}
	return gameSettingsSchema.parse(merged);
}

export function parseGameSettings(raw: string | null): GameSettings {
	if (raw === null) {
		return DEFAULT_SETTINGS;
	}

	try {
		const parsed = migrateRawGameSettings(JSON.parse(raw) as unknown);
		if (!parsed || typeof parsed !== 'object') {
			return DEFAULT_SETTINGS;
		}
		// Merge before validate so legacy / partial storage keeps flags like demoBeforePlay
		// instead of wiping to defaults on a single invalid key.
		return sanitizeGameSettings(parsed as Partial<GameSettings>);
	} catch {
		return DEFAULT_SETTINGS;
	}
}

export function serializeGameSettings(settings: GameSettings): string {
	const sanitized = sanitizeGameSettings(settings);
	return JSON.stringify(gameSettingsSchema.parse(sanitized));
}

/** Endless stream: Poison Rhythm checkbox, or Bucket Drumming (always endless in play). */
export function isEndlessMode(settings: GameSettings): boolean {
	return settings.endless || settings.gameMode === 'bucketTrainer';
}

export function isBucketTrainerMode(settings: GameSettings): boolean {
	return settings.gameMode === 'bucketTrainer';
}

export function shouldShowMuteOnStudentPass(settings: GameSettings): boolean {
	return settings.demoBeforePlay;
}

/**
 * Accents overlay visibility. Difficulty never enables accents alone.
 */
export function shouldShowAccents(settings: GameSettings): boolean {
	return settings.accents === 'on';
}

/**
 * Sticking (L/R) overlay visibility.
 * Enabled by the Sticking setting only; difficulty alone never shows sticking.
 */
export function shouldShowSticking(settings: GameSettings): boolean {
	return settings.sticking !== 'off';
}

/**
 * Whether poison is active for generation / HUD.
 * Difficulty alone never enables poison.
 */
export function isPoisonEnabled(settings: GameSettings): boolean {
	if (isBucketTrainerMode(settings)) {
		return false;
	}
	return settings.poisonMode !== 'off';
}

export type GameModeHudBadge = {
	label: string;
	tone: 'endless' | 'bucket' | 'classic';
};

export function gameModeHudBadge(
	settings: Pick<GameSettings, 'gameMode' | 'endless'>,
): GameModeHudBadge | null {
	switch (settings.gameMode) {
		case 'bucketTrainer':
			return { label: 'BUCKET', tone: 'bucket' };
		default:
			return settings.endless ? { label: 'ENDLESS', tone: 'endless' } : null;
	}
}
