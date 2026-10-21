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
 * Listening (demo) = dashed primary frame + Secondary notes; Playing
 * (student) = solid secondary frame + Dominant notes. Reuse the same ranks
 * for Jazz Mode note chrome. Flat at rest — no elevation shadows.
 */
export function measureShellClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'count-in':
			return `${hierarchyBorderClass('provisional', 'mid')} rounded-lg bg-surface`;
		case 'listening':
			return `${hierarchyBorderClass('provisional', 'primary')} rounded-lg bg-surface text-secondary`;
		case 'playing':
			return `${hierarchyBorderClass('active', 'secondary')} rounded-lg bg-surface text-primary`;
		default:
			return `${hierarchyBorderClass('emphasis', 'secondary')} rounded-lg bg-surface`;
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
			return `${hierarchyBorderClass('structure', 'secondary')} bg-surface`;
	}
}

/**
 * Hit cell fill — Secondary during Listening (demo), Dominant during
 * Playing (student); Dominant otherwise (idle / count-in).
 */
export function measureHitClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	switch (phase) {
		case 'listening':
			return 'bg-secondary';
		case 'playing':
			return 'bg-primary';
		default:
			return 'bg-primary';
	}
}

/** Playback step ring — contrast against the hit fill color. */
export function measureHitHighlightClass(
	phase: MeasurePlaybackPhase | undefined,
): string {
	return phase === 'listening'
		? 'ring-2 ring-primary ring-inset transition-shadow duration-200'
		: 'ring-2 ring-secondary ring-inset transition-shadow duration-200';
}
