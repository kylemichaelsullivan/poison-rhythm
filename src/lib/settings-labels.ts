import type {
	GameMode,
	RhythmRenderMode,
	ScrollDirection,
} from '@/lib/settings-schema';

/** Title Case display-mode names (Settings segments + status toast). */
export const DISPLAY_MODE_LABELS: Record<RhythmRenderMode, string> = {
	grid: 'Grid',
	notation: 'Notation',
	scroll: 'Scroll',
};

/** ALL CAPS badge text derived from Title Case labels. */
export function displayModeBadgeLabel(mode: RhythmRenderMode): string {
	return DISPLAY_MODE_LABELS[mode].toUpperCase();
}

/** Full play-mode names (options list + status toast). */
export const GAME_MODE_LABELS: Record<GameMode, string> = {
	default: 'Poison Rhythm',
	bucketTrainer: 'Bucket Drumming',
};

export const PRACTICE_TOGGLE_LABELS = {
	showNextMeasure: 'Show Next Measure',
	demoBeforePlay: 'Listen Before You Play',
} as const;

export type ScrollDir = Exclude<ScrollDirection, 'none'>;

export const SCROLL_DIRECTION_LABELS: Record<ScrollDir, string> = {
	up: 'Up',
	down: 'Down',
	left: 'Left',
	right: 'Right',
};

export const MUTE_CHANNEL_LABELS = {
	metronome: 'Metronome',
	playback: 'Playback',
	preview: 'Preview',
} as const;

export type MuteChannelKey = keyof typeof MUTE_CHANNEL_LABELS;

export const MUTE_CHANNEL_NAMES = [
	MUTE_CHANNEL_LABELS.metronome,
	MUTE_CHANNEL_LABELS.playback,
	MUTE_CHANNEL_LABELS.preview,
] as const;

export const MUTE_ALL_CHANNELS_LABEL = 'All Channels';
export const MUTE_PLAYBACK_AND_PREVIEW_LABEL = 'Playback and Preview';
export const MUTE_CHANNELS_RESTORED = 'Channels: Restored';

export const ENDLESS_LABEL = 'Endless';
