import { DISPLAY_MODE_LABELS, GAME_MODE_LABELS } from '@/lib/settings-labels';
import type { GameMode, RhythmRenderMode } from '@/lib/settings-schema';
import type { SegmentOption } from './SegmentButton';

export {
	DISPLAY_MODE_LABELS,
	displayModeBadgeLabel,
	ENDLESS_LABEL,
	GAME_MODE_LABELS,
	MUTE_CHANNEL_LABELS,
	MUTE_CHANNEL_NAMES,
	PRACTICE_TOGGLE_LABELS,
	SCROLL_DIRECTION_LABELS,
} from '@/lib/settings-labels';

export const RENDER_MODE_OPTIONS: SegmentOption<RhythmRenderMode>[] = [
	{ label: DISPLAY_MODE_LABELS.grid, value: 'grid' },
	{ label: DISPLAY_MODE_LABELS.notation, value: 'notation' },
	{ label: DISPLAY_MODE_LABELS.scroll, value: 'scroll' },
];

export type GameModeOption = {
	value: GameMode;
	label: string;
	description: string;
};

export const GAME_MODE_OPTIONS: GameModeOption[] = [
	{
		value: 'default',
		label: GAME_MODE_LABELS.default,
		description: 'Play Everything EXCEPT the Poison Rhythm',
	},
	{
		value: 'bucketTrainer',
		label: GAME_MODE_LABELS.bucketTrainer,
		description: 'Simple, Endless Play',
	},
];
