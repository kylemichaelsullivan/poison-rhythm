/**
 * Classic (non-Endless) poison-hit overlay: bottle under the title, then a
 * splat explosion that clears. Keep CSS durations in sync with `src/index.css`.
 * Motion follows `prefers-reduced-motion` from system preferences.
 */

export const POISON_HIT_TITLE = 'That’s the Poison!';

/** Hold the intact bottle before it explodes. */
export const POISON_HIT_BOTTLE_HOLD_MS = 650;

/** Explosion / splat burst length after the hold. */
export const POISON_HIT_SPLAT_MS = 750;

/** Fade the whole overlay off-screen before auto-dismiss. */
export const POISON_HIT_FADE_OUT_MS = 400;

/**
 * Total time before auto-dismiss: hold + splat + fade.
 * (0.65 + 0.75 + 0.4 = 1.8s)
 */
export const POISON_HIT_DURATION_MS =
	POISON_HIT_BOTTLE_HOLD_MS + POISON_HIT_SPLAT_MS + POISON_HIT_FADE_OUT_MS;
