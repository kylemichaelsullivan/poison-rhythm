export type MeasurePlaybackPhase =
	| 'idle'
	| 'count-in'
	| 'listening'
	| 'playing';

/**
 * Outer shell for grid / notation measure surfaces by playback phase.
 * Keep border width constant across count-in / listening / playing so the
 * carousel does not jump when the pass changes.
 *
 * Listening = dashed primary frame + ink (black/white) notes; Playing = solid
 * secondary glow frame + secondary notes.
 */
export function measureShellClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'count-in':
			return 'border-2 border-dashed border-mid rounded-lg bg-surface shadow-soft';
		case 'listening':
			return 'border-2 border-dashed border-primary rounded-lg bg-surface text-black shadow-primary-glow';
		case 'playing':
			return 'border-2 border-secondary rounded-lg bg-surface text-secondary shadow-secondary-glow';
		default:
			return 'border-2 border-primary/25 rounded-lg bg-primary/5 shadow-soft';
	}
}

/** Beat-group inset borders — primary while listening, secondary while playing. */
export function measureBeatGroupClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'listening':
			return 'border border-primary bg-surface';
		case 'playing':
			return 'border border-secondary bg-surface';
		case 'count-in':
			return 'border border-mid bg-surface';
		default:
			return 'border border-primary/30 bg-surface';
	}
}

/**
 * Hit cell fill — ink during Listening (black in light / white in dark),
 * secondary during Playing; primary otherwise.
 */
export function measureHitClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'listening':
			return 'bg-black shadow-soft';
		case 'playing':
			return 'bg-secondary shadow-soft';
		default:
			return 'bg-primary shadow-soft';
	}
}

/** Playback step ring — contrast against the hit fill color. */
export function measureHitHighlightClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	return phase === 'playing'
		? 'ring-2 ring-primary ring-inset transition-shadow duration-200'
		: 'ring-2 ring-secondary ring-inset transition-shadow duration-200';
}
