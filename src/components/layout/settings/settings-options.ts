import ArrowDownIcon from '@/assets/svg/arrow-down.svg?react';
import ArrowLeftIcon from '@/assets/svg/arrow-left.svg?react';
import ArrowRightIcon from '@/assets/svg/arrow-right.svg?react';
import ArrowUpIcon from '@/assets/svg/arrow-up.svg?react';
import type {
	GameMode,
	RhythmRenderMode,
	ScrollDirection,
	StickingMode,
} from '@/lib/settings-schema';
import type { SegmentOption } from './SegmentButton';

export const SCROLL_DIRECTION_OPTIONS: SegmentOption<
	Exclude<ScrollDirection, 'none'>
>[] = [
	{ label: 'Down', value: 'down', icon: ArrowDownIcon },
	{ label: 'Up', value: 'up', icon: ArrowUpIcon },
	{ label: 'Right', value: 'right', icon: ArrowRightIcon },
	{ label: 'Left', value: 'left', icon: ArrowLeftIcon },
];

export const RENDER_MODE_OPTIONS: SegmentOption<RhythmRenderMode>[] = [
	{ label: 'Grid', value: 'grid' },
	{ label: 'Notation', value: 'notation' },
	{ label: 'Scroll', value: 'scroll' },
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
