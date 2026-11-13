import {
	DISPLAY_MODE_LABELS,
	ENDLESS_LABEL,
	GAME_MODE_LABELS,
	MUTE_ALL_CHANNELS_LABEL,
	MUTE_CHANNEL_LABELS,
	MUTE_CHANNELS_RESTORED,
	MUTE_PLAYBACK_AND_PREVIEW_LABEL,
	PRACTICE_TOGGLE_LABELS,
	SCROLL_DIRECTION_LABELS,
} from '@/lib/settings-labels';
import { SUBDIVISION_PROSE_LABELS } from '@/lib/subdivision-levels';
import {
	NEW_ROUND_TITLE,
	REUSE_ROUND_TITLE,
	statusOnOffLabel,
} from '@/lib/ui-copy';
import type { SubdivisionLevel } from '@/lib/preference-schemas';
import type {
	GameMode,
	PoisonMode,
	RhythmRenderMode,
	ScrollDirection,
} from '@/lib/settings-schema';

/** Screen-relevant status fields the announcer diffs. */
export type StatusToastSnapshot = {
	showNextMeasure: boolean;
	demoBeforePlay: boolean;
	poisonMode: PoisonMode;
	rhythmRenderMode: RhythmRenderMode;
	scrollDirection: ScrollDirection;
	gameMode: GameMode;
	endless: boolean;
	subdivisionLevel: SubdivisionLevel;
	muteMetronome: boolean;
	mutePlayback: boolean;
	mutePreview: boolean;
};

const POISON_TOAST: Record<PoisonMode, string> = {
	visible: 'Poison: Visible',
	hidden: 'Poison: Hidden During Playback',
	off: 'Poison: Off',
};

function muteToastMessage(label: string, muted: boolean): string {
	return muted ? `${label}: Muted` : `${label}: Unmuted`;
}

/** Poison section New (+) — new poison and new measures. */
export function newRoundToastMessage(): string {
	return NEW_ROUND_TITLE;
}

/** Poison section Reuse — keep poison, regenerate measures. */
export function reuseRoundToastMessage(): string {
	return REUSE_ROUND_TITLE;
}

/**
 * One user-facing line for a status transition, or null when nothing worth
 * announcing changed. Mute-all / restore collapse to a single message.
 */
export function statusToastForTransition(
	prev: StatusToastSnapshot,
	next: StatusToastSnapshot,
): string | null {
	const muteChanged = {
		metronome: prev.muteMetronome !== next.muteMetronome,
		playback: prev.mutePlayback !== next.mutePlayback,
		preview: prev.mutePreview !== next.mutePreview,
	};
	const muteChangeCount =
		Number(muteChanged.metronome) +
		Number(muteChanged.playback) +
		Number(muteChanged.preview);
	const allMuted = next.muteMetronome && next.mutePlayback && next.mutePreview;
	const allWereMuted =
		prev.muteMetronome && prev.mutePlayback && prev.mutePreview;

	if (muteChangeCount >= 2 && allMuted) {
		return `${MUTE_ALL_CHANNELS_LABEL}: Muted`;
	}
	if (muteChangeCount >= 2 && allWereMuted && !allMuted) {
		return MUTE_CHANNELS_RESTORED;
	}
	if (muteChanged.playback && muteChanged.preview) {
		if (next.mutePlayback && next.mutePreview) {
			return `${MUTE_PLAYBACK_AND_PREVIEW_LABEL}: Muted`;
		}
		if (!next.mutePlayback && !next.mutePreview) {
			return `${MUTE_PLAYBACK_AND_PREVIEW_LABEL}: Unmuted`;
		}
	}

	if (prev.rhythmRenderMode !== next.rhythmRenderMode) {
		return `Display: ${DISPLAY_MODE_LABELS[next.rhythmRenderMode]}`;
	}
	if (
		prev.scrollDirection !== next.scrollDirection &&
		next.scrollDirection !== 'none'
	) {
		return `Scroll: ${SCROLL_DIRECTION_LABELS[next.scrollDirection]}`;
	}
	if (prev.poisonMode !== next.poisonMode) {
		return POISON_TOAST[next.poisonMode];
	}
	if (prev.showNextMeasure !== next.showNextMeasure) {
		return statusOnOffLabel(
			PRACTICE_TOGGLE_LABELS.showNextMeasure,
			next.showNextMeasure,
		);
	}
	if (prev.demoBeforePlay !== next.demoBeforePlay) {
		return statusOnOffLabel(
			PRACTICE_TOGGLE_LABELS.demoBeforePlay,
			next.demoBeforePlay,
		);
	}
	if (prev.gameMode !== next.gameMode) {
		return `Play Mode: ${GAME_MODE_LABELS[next.gameMode]}`;
	}
	if (prev.endless !== next.endless) {
		return statusOnOffLabel(ENDLESS_LABEL, next.endless);
	}
	if (prev.subdivisionLevel !== next.subdivisionLevel) {
		return `Show Notes: ${SUBDIVISION_PROSE_LABELS[next.subdivisionLevel]}`;
	}
	if (muteChanged.metronome) {
		return muteToastMessage(MUTE_CHANNEL_LABELS.metronome, next.muteMetronome);
	}
	if (muteChanged.playback) {
		return muteToastMessage(MUTE_CHANNEL_LABELS.playback, next.mutePlayback);
	}
	if (muteChanged.preview) {
		return muteToastMessage(MUTE_CHANNEL_LABELS.preview, next.mutePreview);
	}

	return null;
}
