import type {
	GameMode,
	RhythmRenderMode,
	StickingMode,
} from '@/lib/settings-schema';
import type { SegmentOption } from './SegmentButton';

export const RENDER_MODE_OPTIONS: SegmentOption<RhythmRenderMode>[] = [
	{ label: 'Grid', value: 'grid' },
	{ label: 'Notation', value: 'notation' },
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
		label: 'Poison Rhythm',
		description: 'Practice against a poison rhythm among decoy measures.',
	},
	{
		value: 'bucketTrainer',
		label: 'Bucket Drumming',
		description: 'No poison rhythm and endless play.',
	},
];
