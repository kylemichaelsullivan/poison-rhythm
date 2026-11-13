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

const SUBDIVISION_TOAST: Record<SubdivisionLevel, string> = {
	quarters: 'Quarter Notes',
	eighths: 'Eighth Notes',
	sixteenths: 'Sixteenth Notes',
};

const DISPLAY_MODE_TOAST: Record<RhythmRenderMode, string> = {
	grid: 'Grid',
	notation: 'Notation',
	scroll: 'Scroll',
};

const SCROLL_DIRECTION_TOAST: Record<
	Exclude<ScrollDirection, 'none'>,
	string
> = {
	up: 'Up',
	down: 'Down',
	left: 'Left',
	right: 'Right',
};

const GAME_MODE_TOAST: Record<GameMode, string> = {
	default: 'Poison Rhythm',
	bucketTrainer: 'Bucket Drumming',
};

const POISON_TOAST: Record<PoisonMode, string> = {
	visible: 'Poison: Visible',
	hidden: 'Poison: Hidden During Playback',
	off: 'Poison: Off',
};

function muteToastMessage(label: string, muted: boolean): string {
	return muted ? `${label}: Muted` : `${label}: Unmuted`;
}

function practiceToggleToastMessage(label: string, enabled: boolean): string {
	return `${label}: ${enabled ? 'On' : 'Off'}`;
}

/** Poison section New (+) — new poison and new measures. */
export function newRoundToastMessage(): string {
	return 'New Poison Rhythm, New Measures';
}

/** Poison section Reuse — keep poison, regenerate measures. */
export function reuseRoundToastMessage(): string {
	return 'New Measures, Same Poison Rhythm';
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
		return 'All Channels: Muted';
	}
	if (muteChangeCount >= 2 && allWereMuted && !allMuted) {
		return 'Channels: Restored';
	}
	if (muteChanged.playback && muteChanged.preview) {
		if (next.mutePlayback && next.mutePreview) {
			return 'Playback and Preview: Muted';
		}
		if (!next.mutePlayback && !next.mutePreview) {
			return 'Playback and Preview: Unmuted';
		}
	}

	if (prev.rhythmRenderMode !== next.rhythmRenderMode) {
		return `Display: ${DISPLAY_MODE_TOAST[next.rhythmRenderMode]}`;
	}
	if (
		prev.scrollDirection !== next.scrollDirection &&
		next.scrollDirection !== 'none'
	) {
		return `Scroll: ${SCROLL_DIRECTION_TOAST[next.scrollDirection]}`;
	}
	if (prev.poisonMode !== next.poisonMode) {
		return POISON_TOAST[next.poisonMode];
	}
	if (prev.showNextMeasure !== next.showNextMeasure) {
		return practiceToggleToastMessage(
			'Show Next Measure',
			next.showNextMeasure,
		);
	}
	if (prev.demoBeforePlay !== next.demoBeforePlay) {
		return practiceToggleToastMessage(
			'Listen Before You Play',
			next.demoBeforePlay,
		);
	}
	if (prev.gameMode !== next.gameMode) {
		return `Play Mode: ${GAME_MODE_TOAST[next.gameMode]}`;
	}
	if (prev.endless !== next.endless) {
		return practiceToggleToastMessage('Endless', next.endless);
	}
	if (prev.subdivisionLevel !== next.subdivisionLevel) {
		return `Show Notes: ${SUBDIVISION_TOAST[next.subdivisionLevel]}`;
	}
	if (muteChanged.metronome) {
		return muteToastMessage('Metronome', next.muteMetronome);
	}
	if (muteChanged.playback) {
		return muteToastMessage('Playback', next.mutePlayback);
	}
	if (muteChanged.preview) {
		return muteToastMessage('Preview', next.mutePreview);
	}

	return null;
}
