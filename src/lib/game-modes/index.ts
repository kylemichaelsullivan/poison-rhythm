import type { SubdivisionLevel } from '@/lib/preference-schemas';
import { generateRound } from '@/lib/rhythm';
import type { GameSettings } from '@/lib/settings-schema';
import { isEndlessMode } from '@/lib/settings-schema';
import type { Round } from '@/types';

export type GameModeContext = {
	difficulty: number;
	subdivisionLevel: SubdivisionLevel;
	settings: GameSettings;
	roundNumber: number;
};

export type GameModeResult = {
	round: Round;
	shouldStop: boolean;
	visualHints: VisualHint[];
};

export type VisualHint = {
	type: 'sticking' | 'poison';
	message?: string;
};

export type GameModeHandler = {
	createRound: (ctx: GameModeContext) => Round;
	onMeasureComplete: (
		ctx: GameModeContext,
		round: Round,
		measureIndex: number,
	) => { shouldStop: boolean; visualHints: VisualHint[] };
	getVisualHints: (ctx: GameModeContext, round: Round) => VisualHint[];
};

export const defaultMode: GameModeHandler = {
	createRound: (ctx) => generateRound(ctx),
	onMeasureComplete: (_ctx, round, measureIndex) => {
		const isPoison =
			round.poisonIndex >= 0 && measureIndex === round.poisonIndex;
		return {
			shouldStop: isPoison,
			visualHints: isPoison ? [{ type: 'poison' }] : [],
		};
	},
	getVisualHints: () => [],
};

export const bucketTrainerMode: GameModeHandler = {
	createRound: (ctx) =>
		generateRound({
			...ctx,
			settings: {
				...ctx.settings,
				poisonMode: 'off',
			},
		}),
	onMeasureComplete: () => ({
		shouldStop: false,
		visualHints: [],
	}),
	getVisualHints: () => [],
};

const MODE_HANDLERS: Record<GameSettings['gameMode'], GameModeHandler> = {
	default: defaultMode,
	bucketTrainer: bucketTrainerMode,
};

export function getGameModeHandler(
	gameMode: GameSettings['gameMode'],
): GameModeHandler {
	return MODE_HANDLERS[gameMode];
}

export function createRoundForMode(ctx: GameModeContext): Round {
	return getGameModeHandler(ctx.settings.gameMode).createRound(ctx);
}

export function onMeasureCompleteForMode(
	ctx: GameModeContext,
	round: Round,
	measureIndex: number,
): { shouldStop: boolean; visualHints: VisualHint[] } {
	const result = getGameModeHandler(ctx.settings.gameMode).onMeasureComplete(
		ctx,
		round,
		measureIndex,
	);
	if (isEndlessMode(ctx.settings)) {
		return { ...result, shouldStop: false };
	}
	return result;
}
