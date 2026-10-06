import { hierarchyBorderClass } from '@/lib/hierarchy-border';

export type MeasurePlaybackPhase =
	| 'idle'
	| 'count-in'
	| 'listening'
	| 'playing';

/**
 * Outer shell for grid / notation measure surfaces by playback phase.
 * Border hierarchy from {@link hierarchyBorderClass}: provisional (dashed)
 * for count-in / listening; active solid for playing; emphasis for idle.
 * Keep border width constant across phases so the carousel does not jump.
 *
 * Listening = dashed primary frame + ink notes; Playing = solid secondary
 * frame + secondary notes. Reuse the same ranks for Jazz Mode note chrome.
 */
export function measureShellClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'count-in':
			return `${hierarchyBorderClass('provisional', 'mid')} rounded-lg bg-surface shadow-soft`;
		case 'listening':
			return `${hierarchyBorderClass('provisional', 'primary')} rounded-lg bg-surface text-black shadow-primary-glow`;
		case 'playing':
			return `${hierarchyBorderClass('active', 'secondary')} rounded-lg bg-surface text-secondary shadow-secondary-glow`;
		default:
			return `${hierarchyBorderClass('emphasis', 'primary-soft')} rounded-lg bg-primary/5 shadow-soft`;
	}
}

/** Beat-group inset borders — structure rank nested inside the shell. */
export function measureBeatGroupClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'listening':
			return `${hierarchyBorderClass('structure', 'primary')} bg-surface`;
		case 'playing':
			return `${hierarchyBorderClass('structure', 'secondary')} bg-surface`;
		case 'count-in':
			return `${hierarchyBorderClass('structure', 'mid')} bg-surface`;
		default:
			return `${hierarchyBorderClass('structure', 'primary-soft')} bg-surface`;
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
