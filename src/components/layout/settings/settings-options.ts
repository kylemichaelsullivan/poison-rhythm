import { DISPLAY_MODE_LABELS, GAME_MODE_LABELS } from '@/lib/settings-labels';
import type {
	GameMode,
	RhythmRenderMode,
	StickingMode,
} from '@/lib/settings-schema';
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

export const STICKING_OPTIONS: SegmentOption<StickingMode>[] = [
	{ label: 'Off', value: 'off' },
	{ label: 'Alternate', value: 'alternating' },
	{ label: 'Dominant', value: 'dominant' },
	{ label: 'Random', value: 'random' },
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
		description: 'Practice against a poison rhythm among decoy measures.',
	},
	{
		value: 'bucketTrainer',
		label: GAME_MODE_LABELS.bucketTrainer,
		description: 'No poison rhythm and endless play.',
	},
];
